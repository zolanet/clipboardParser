import * as vscode from "vscode";

export async function pasteEtcsFilenames() {
  let text = await vscode.env.clipboard.readText();
  writeToCurrentEditor(parseToListOfEtcsFiles(text));
}

export async function pasteAsMdUri() {
  let text = await vscode.env.clipboard.readText();
  writeToCurrentEditor(formatAsMdLink(text.trim()));
}

function parseToListOfEtcsFiles(text: string): string[] {
  const re = new RegExp("\\w\\.\\d.+\\.json", "g");
  const matches = text.match(re);
  if (matches) {
    let unique = [...new Set(matches)];
    unique.sort();
    return unique;
  }
  vscode.window.showInformationMessage("Clipboard does not contain filenames.");
  return stringToList(text);
}

function stringToList(text: string): string[] {
  return text.split("\n");
}

function formatAsMdLink(text: string): string[] {
  if (isProperUrl(text)) {
    let uri = vscode.Uri.parse(text);
    let filename = uri.path.split("/").pop();
    return stringToList(`[${filename}](${uri})\n`);
  }

  vscode.window.showInformationMessage("Clipboard does not contain a URL.");
  return stringToList(`${text}\n`);
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

function isProperUrl(url: string): boolean {
  const re = new RegExp("[^-A-Za-z0-9+&@#/%?=~_|!:,.;()]", "g");
  return !re.test(url);
}
