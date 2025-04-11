import * as vscode from 'vscode';

export async function toJira() {
    const text = await getSelectedText();
    let jira = to_jira(text);
    await setClipboard(jira);
}

export async function toMd() {
    const text = await getSelectedText();
    let md = convertStarToDash(to_markdown(text));
    await setClipboard(md);
}

async function getSelectedText() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        deselectText(editor);
        return selectedText;
    }
    return '';
}

function convertStarToDash(jira: string) {
    const regex = /^( *)*\*\s/gm;
    jira = jira.replace(regex, (match, g1) => {
        const level = g1?.length || 0; // calculate the level based on the number of spaces
        return ' '.repeat(level) + '- ';
    });
    return jira;
}
// the following code is based on https://www.npmjs.com/package/jira2md
function to_markdown(str: string) {
    return (
        str
            // Un-Ordered Lists
            .replace(/^[ \t]*(\*+)\s+/gm, (match, stars) => {
                return `${Array(stars.length).join('  ')}* `;
            })
            // Ordered lists
            .replace(/^[ \t]*(#+)\s+/gm, (match, nums) => {
                return `${Array(nums.length).join('   ')}1. `;
            })
            // Headers 1-6
            .replace(/^h([0-6])\.(.*)$/gm, (match, level, content) => {
                return Array(parseInt(level, 10) + 1).join('#') + content;
            })
            // Bold
            .replace(/\*(\S.*)\*/g, '**$1**')
            // Italic
            .replace(/_(\S.*)_/g, '*$1*')
            // Monospaced text
            .replace(/\{\{([^}]+)\}\}/g, '`$1`')
            // Citations (buggy)
            // .replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g, '<cite>$1</cite>')
            // Inserts
            .replace(/\+([^+]*)\+/g, '<ins>$1</ins>')
            // Superscript
            .replace(/\^([^^]*)\^/g, '<sup>$1</sup>')
            // Subscript
            .replace(/~([^~]*)~/g, '<sub>$1</sub>')
            // Strikethrough
            .replace(/(\s+)-(\S+.*?\S)-(\s+)/g, '$1~~$2~~$3')
            // Code Block
            .replace(
                /\{code(:([a-z]+))?([:|]?(title|borderStyle|borderColor|borderWidth|bgColor|titleBGColor)=.+?)*\}([^]*?)\n?\{code\}/gm,
                '```$2$5\n```'
            )
            // Pre-formatted text
            .replace(/{noformat}/g, '```')
            // Un-named Links
            .replace(/\[([^|]+?)\]/g, '<$1>')
            // Images
            .replace(/!(.+)!/g, '![]($1)')
            // Named Links
            .replace(/\[(.+?)\|(.+?)\]/g, '[$1]($2)')
            // Single Paragraph Blockquote
            .replace(/^bq\.\s+/gm, '> ')
            // Remove color: unsupported in md
            .replace(/\{color:[^}]+\}([^]*?)\{color\}/gm, '$1')
            // panel into table
            .replace(/\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm, '\n| $1 |\n| --- |\n| $2 |')
            // table header
            .replace(/^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm, (match, headers) => {
                const singleBarred = headers.replace(/\|\|/g, '|');
                return `${singleBarred}\n${singleBarred.replace(/\|[^|]+/g, '| --- ')}`;
            })
            // remove leading-space of table headers and rows
            .replace(/^[ \t]*\|/gm, '|')
    );

}


function to_jira(str: string) {
    const map = {
        // cite: '??',
        del: '-',
        ins: '+',
        sup: '^',
        sub: '~',
    };

    return (
        str
            // Tables
            .replace(
                /^\n((?:\|.*?)+\|)[ \t]*\n((?:\|\s*?-{3,}\s*?)+\|)[ \t]*\n((?:(?:\|.*?)+\|[ \t]*\n)*)/gm,
                (match, headerLine, separatorLine, rowstr) => {
                    const headers = headerLine.match(/[^|]+(?=\|)/g);
                    const separators = separatorLine.match(/[^|]+(?=\|)/g);
                    if (headers.length !== separators.length) { return match; }

                    const rows = rowstr.split('\n');
                    if (rows.length === 2 && headers.length === 1)
                    // Panel
                    {
                        return `{panel:title=${headers[0].trim()}}\n${rowstr
                            .replace(/^\|(.*)[ \t]*\|/, '$1')
                            .trim()}\n{panel}\n`;
                    }

                    return `\n||${headers.join('||')}||\n${rowstr}`;
                }
            )
            // Bold, Italic, and Combined (bold+italic)
            .replace(/([*_]+)(\S.*?)\1/g, (match, wrapper, content) => {
                switch (wrapper.length) {
                    case 1:
                        return `_${content}_`;
                    case 2:
                        return `*${content}*`;
                    case 3:
                        return `_*${content}*_`;
                    default:
                        return wrapper + content + wrapper;
                }
            })
            // All Headers (# format)
            .replace(/^([#]+)(.*?)$/gm, (match, level, content) => {
                return `h${level.length}.${content}`;
            })
            // Headers (H1 and H2 underlines)
            .replace(/^(.*?)\n([=-]+)$/gm, (match, content, level) => {
                return `h${level[0] === '=' ? 1 : 2}. ${content}`;
            })
            // Ordered lists
            .replace(/^([ \t]*)\d+\.\s+/gm, (match, spaces) => {
                return `${Array(Math.floor(spaces.length / 3) + 1)
                    .fill('#')
                    .join('')} `;
            })
            // Un-Ordered Lists spaces
            .replace(/^( *)[\*-]\s+/gm, (match, spaces) => {
                return `${Array(Math.floor(spaces.length / 2 + 1))
                    .fill('*')
                    .join('')} `;
            })
            // Un-Ordered Lists tabs
            .replace(/^(\t+)[\*-]\s+/gm, (match, spaces) => {
                return `${Array(Math.floor(spaces.length + 1))
                    .fill('*')
                    .join('')} `;
            })
            // Headers (h1 or h2) (lines "underlined" by ---- or =====)
            // Citations, Inserts, Subscripts, Superscripts, and Strikethroughs
            .replace(new RegExp(`<(${Object.keys(map).join('|')})>(.*?)</\\1>`, 'g'), (match, from: keyof typeof map, content) => {
                const to = map[from];
                return to + content + to;
            })
            // Other kind of strikethrough
            .replace(/(\s+)~~(.*?)~~(\s+)/g, '$1-$2-$3')
            // Named/Un-Named Code Block
            .replace(/```(.+\n)?((?:.|\n)*?)```/g, (match, synt, content) => {
                let code = '{code}';
                if (synt) {
                    code = `{code:${synt.replace(/\n/g, '')}}\n`;
                }
                return `${code}${content}{code}`;
            })
            // Inline-Preformatted Text
            .replace(/`([^`]+)`/g, '{{$1}}')
            // Images
            .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '!$1!')
            // Named Link
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]')
            // Un-Named Link
            .replace(/<([^>]+)>/g, '[$1]')
            // Single Paragraph Blockquote
            .replace(/^>/gm, 'bq.')
    );
}

async function setClipboard(text: string) {
    return await vscode.env.clipboard.writeText(text);
}

async function deselectText(editor: vscode.TextEditor) {
    if (editor) {
        const selection = editor.selection;
        const range = new vscode.Range(selection.start, selection.end);

        // Calculate the position of the next line
        const nextLine = range.end.line + 1;
        const nextLinePosition = new vscode.Position(nextLine, 0);

        // Set the cursor to the start of the next line
        editor.selection = new vscode.Selection(nextLinePosition, nextLinePosition);
        editor.revealRange(new vscode.Range(nextLinePosition, nextLinePosition));
    }
}
