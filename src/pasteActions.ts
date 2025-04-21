import * as vscode from "vscode";

const ETCS_FILENAME = /\w\.\d.+\.json/gm;
const REPORT_SEPARATOR = /(?<=│)([^│]+)(?=│)/gm;
const PROPER_URL = /[^-A-Za-z0-9+&@#/%?=~_|!:,.;()]/gm;
const UNQUOTED_KEY = /(\b\w+\b)(?=\=)/gm;
const UNQUOTED_VALUE = /(?<=\=)(\b(?!null|true|false|{).+\b)\)*(?=,)*/gm;
const INLINE_COMMA = /,(?!\n)/g;
const LOG_HEADER = /^.+\| /gm;
const MORE = /(... \d+ more(?=\w))/;

export async function pasteEtcsFilenames() {
  let text = await getClipboard();
  writeToCurrentEditor(parseTolist(text, ETCS_FILENAME));
}

export async function pasteComparatorReport() {
  let text = await getClipboard();
  writeToCurrentEditor(extractComparatorData(text));
}

export async function pasteAsMdUri() {
  let text = await getClipboard();
  writeToCurrentEditor(formatAsMdLink(text.trim()));
}

export async function prettyPasteLogs() {
  let text = await getClipboard();
  let output = extractLogParts(text);
  writeToCurrentEditor(output === "" ? text.split('\n') : output.split('\n'));
}

export async function pasteRequestIdsAsFiles() {
  let text = await getClipboard();
  let output = extractFilesFromRequestId(text);
  writeToCurrentEditor(output.length === 0 ? text.split('\n') : output);
}

export function pasteNonBreakSpace() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, ' ');
    });
  }
}

export async function pasteConsoleData() {
  const text = await getClipboard();
  writeToCurrentEditor(extractConsolaDataParts(text));
}

/* --- "Private Functions here" --- */

async function getClipboard() {
  return await vscode.env.clipboard.readText();
}

function writeToCurrentEditor(content: string[]) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit((editBuilder) => {
      content.forEach((line) => {
        editBuilder.insert(editor.selection.active, `${line}\n`);
      });
    });
  }
}

function parseTolist(text: string, regexp: RegExp) {
  const matches = text.match(regexp);

  if (matches) {
    return [...new Set(matches.map((match) => "- " + match.trim()))].sort();
  }
  vscode.window.showInformationMessage("Clipboard does not contain filenames.");
  return arrayFromString(text);
}

function arrayFromString(text: string): string[] {
  return text.split("\n");
}

function extractComparatorData(text: string): string[] {
  let lines = text.split(/\n/gm);
  const result = lines.map((line) => {
    let parts = line.match(REPORT_SEPARATOR);
    if (parts) {
      return `- ${parts[0].trim()}; ${parts[1].trim()}; Disabled: ${parts[2].trim()}; TestCases: ${parts[3].trim()}`;
    }
    vscode.window.showInformationMessage("Clipboard does not contain a URL.");
    return line;
  });
  return result.sort();
}

function formatAsMdLink(text: string): string[] {
  if (isProperUrl(text)) {
    let uri = vscode.Uri.parse(text);

    let filename = text.includes("pullrequest") ? "PR" : uri.path.split("/").pop();
    return arrayFromString(`[${filename}](${uri})`);
  }
  vscode.window.showInformationMessage("Clipboard does not contain a URL.");
  return arrayFromString(text);
}

function isProperUrl(url: string): boolean {
  return !PROPER_URL.test(url);
}

function extractLogParts(text: string) {
  // First, convert stringified object to json
  if (text.match(/=/gm)) {
    text = convertToProperObject(text);
  }

  text = extractJsonFromLog(text);
  //count number of {
  text = matchBracesAndBrackets(text);
  //pretty print
  text = prettyPrintJson(text);

  return text.replaceAll(' at ', '\nat ');
}

function matchBracesAndBrackets(text: string) {
  if (text) {
    let openBraces = text.match(/{/g)?.length;
    let closeBraces = text.match(/}/g)?.length;
    // count number of [
    let openBrackets = text.match(/\[/g)?.length;
    let closeBrackets = text.match(/\]/g)?.length;
    //check if number of [ and ] are equal
    if (openBrackets !== closeBrackets) {
      text = text + ']';
    }
    //check if number of { and } are equal
    if (openBraces !== closeBraces) {
      text = text + '}';
    }
  }
  return text;
}

function convertToProperObject(text: string) {
  let finalText = text
    .replace(INLINE_COMMA, ',\n')
    .replaceAll('ErrorHolder', '')
    .replace(MORE, '$1,\n')
    .replaceAll(UNQUOTED_KEY, '"$1"')
    .replaceAll(UNQUOTED_VALUE, '"$1"')
    .replaceAll('\'', '"')
    .replaceAll('=', ':');
  let firstKey = finalText.search(/\".+?\":/);
  //check if first key is precede by {
  if (!/\{/.test(finalText.substring(0, firstKey))) {
    finalText = finalText.substring(0, firstKey) + '{' + finalText.substring(firstKey, finalText.length) + '}';
  }
  return finalText;
}

function prettyPrintJson(text: string) {
  let firstBrace = text.search(/{/);
  let lastBrace = text.search(/(?![^\}]*\})/);
  let betweenBraces = text.substring(firstBrace, lastBrace);
  let prettyJson = '';
  if (betweenBraces) {
    try {
      prettyJson = JSON.stringify(JSON.parse(betweenBraces), null, 2);
    } catch (error) {
      vscode.window.showInformationMessage("Clipboard does not contain valid JSON.");
      prettyJson = betweenBraces;
    }
    return text.replace(betweenBraces, prettyJson);
  }
  return text;
}

function extractJsonFromLog(text: string) {
  if (LOG_HEADER.test(text)) {
    return prettyPrintJson(text.replaceAll(LOG_HEADER, "")
      .replaceAll(/^\n/gm, ""));
  }
  return text;
}

function extractFilesFromRequestId(text: string): string[] {
  if (text.includes(',')) {
    text = extractRequestIdFromCsv(text);
  }

  const regexWithCategory = /^(?<category>.+?)-\d{4}.+\d{3}-(?<testFile>.+?)(?<=_functional|_integration|_support)_(?<testCase>.+?)_\w{8}$/i;
  const regexNoCategory = /^(?:.+?)-(?<testFile>.+?)(?<=_functional|_integration|_support)_(?<testCase>.+?)_\w{8}$/i;

  const result: Record<string, Record<string, string[]>> = {};

  text.split('\n').sort().forEach((line) => {
    const trimmedLine = line.trim();

    const matchWithCategory = regexWithCategory.exec(trimmedLine);
    const matchWithoutCategory = regexNoCategory.exec(trimmedLine);
    if (matchWithCategory?.groups) {
      const { category, testFile, testCase } = matchWithCategory.groups;
      addToResult(result, category, testFile, testCase);
    } else if (matchWithoutCategory?.groups) {
      const { testFile, testCase } = matchWithoutCategory.groups;
      addToResult(result, 'no-category', testFile, testCase);
    } else {
      addToResult(result, 'no-category', 'no-test-file', trimmedLine);
    }
  });

  return Object.entries(result).flatMap(([category, testFiles]) => [
    `h2.${category}`,
    ...Object.entries(testFiles).flatMap(([testFile, testCases]) => [
      `* ${testFile}`,
      ...testCases.map((testCase) => `** ${testCase}`)
    ])
  ]);
}

function addToResult(result: Record<string, Record<string, string[]>>, category: string, testFile: string, testCase: string) {
  const formattedTestFile = testFile
    .replace(/_/g, '-')
    .replace(/(^[A-Z])-(\d+)-(\d+)-(\d+)/gm, '$1.$2.$3.$4');

  result[category] = result[category] || {};
  result[category][formattedTestFile] = result[category][formattedTestFile] || [];

  testCase = testCase.replace(/_/g, '-');
  if (result[category][formattedTestFile].includes(testCase)) {
    return;
  }
  result[category][formattedTestFile].push(testCase);
}

function extractRequestIdFromCsv(text: string) {
  const regex = /^(?:".*?",){3}"\s*(.*?)\s*"/gm;
  const matches = Array.from(text.matchAll(regex), match => match[1].replace(/"/g, "").trim());
  //matches.shift(); // remove headers
  text = matches.join('\n');
  return text;
}

function extractConsolaDataParts(text: string) {
  // Normalize line endings to Unix-style (\n)
  text = text.replace(/\r\n/g, '\n');
  const regex = /\.\.\.\t\d+\t\n?/gm;
  // const lines = text.split('\t\n');
  const lines = text.split(regex);
  const result = lines.map((line) => {
    if (line.trim() === "") {
      return "";
    }
    // Split the line by tabs
    const parts = line.split('\t');

    // 0 = filename
    // 1 = testCase \n testCover \n testStep
    // 2 = app
    // 3 = domain
    // 4 = action
    // 5 = result \n assertion \n Duration
    // 6 = Request
    // 7 = Response
    // 8 = Debug Context
    let part1 = parts[1].split('\n');
    let testCase = part1[0];
    let testStep = part1.pop();
    const part5 = parts[5]?.split('\n');
    const errorMessage = part5?.length === 3 ? `  \`\`\`bash\n  ${part5[1]}\n  \`\`\`\n` : '';

    //        filename            testCase         testStep     action         errorMessage;
    return `- ${parts[0]}\n  - ${testCase}\n  - ${testStep} ${parts[4]}\n${errorMessage}`;
  });
  return result;
}