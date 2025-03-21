import * as vscode from "vscode";

const ETCS_FILENAME = /\w\.\d.+\.json/gm;
const REPORT_FILENAME = /(?<=\*\s)\w\.\d.+/gm;
const PROPER_URL = /[^-A-Za-z0-9+&@#/%?=~_|!:,.;()]/gm;
const STACK_TRACE = /(?=\sat)/gm;
const UNQUOTED_KEY = /(\b\w+\b)(?=\=)/gm;
const UNQUOTED_VALUE = /(?<=\=)(\b(?!null|true|false|{).+\b)\)*(?=,)*/gm;
const INLINE_COMMA = /,(?!\n)/g;
const LOG_HEADER = /^.+\| /gm;
const MORE = /(... \d+ more(?=\w))/;

export async function pasteEtcsFilenames() {
  let text = await vscode.env.clipboard.readText();
  writeToCurrentEditor(parseTolist(text, ETCS_FILENAME));
}

export async function pasteComparatorReport() {
  let text = await vscode.env.clipboard.readText();
  writeToCurrentEditor(parseTolist(text.trim(), REPORT_FILENAME));
}

export async function pasteAsMdUri() {
  let text = await vscode.env.clipboard.readText();
  writeToCurrentEditor(formatAsMdLink(text.trim()));
}

export async function prettyPasteStackTrace() {
  let text = await vscode.env.clipboard.readText();
  let lines = text.split(STACK_TRACE);
  writeToCurrentEditor(lines);
}

export async function prettyPasteLogs() {
  let text = await vscode.env.clipboard.readText();
  let output = extractLogParts(text);
  writeToCurrentEditor(output === "" ? text.split('\n') : output.split('\n'));
}

export async function pasteJsonFromErrorReport() {
  let text = await vscode.env.clipboard.readText();
  let output = extractJsonFromLog(text);
  writeToCurrentEditor(output === "" ? text.split('\n') : output.split('\n'));
}

export function pasteNonBreakSpace() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, ' ');
    });
  }
}

export async function extractFilesFromRequestId() {
  //Paste csv content???
  let text = await vscode.env.clipboard.readText();

  let finalText = text
    .replace(/^\s*(.+)-\d{4}.+\d{3}-/gm, 'h2.$1\n* ')//split test-case prefix
    .replace(/_/g, '-')//Replace undurscor _ with -
    .replace(/(^\* [A-Z])-(\d+)-(\d+)-(\d+)/, '$1.$2.$3.$4')//format component id
    .replace(/(?<=-functional|-integration)-(.+)/gm, '\n** $1')//Split test case
    .replace(/-\w{8}\s*$/, '');// remove dlq suffix
  writeToCurrentEditor(finalText.split('\n'));
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

function formatAsMdLink(text: string): string[] {
  if (isProperUrl(text)) {
    let uri = vscode.Uri.parse(text);
    let filename = uri.path.split("/").pop();
    return arrayFromString(`[${filename}](${uri})`);
  }
  vscode.window.showInformationMessage("Clipboard does not contain a URL.");
  return arrayFromString(text);
}

function isProperUrl(url: string): boolean {
  return !PROPER_URL.test(url);
}

export function extractLogParts(text: string) {
  // First, convert stringified object to json
  if (text.match(/=/gm)) {
    text = convertToProperObject(text);
  }
  //count number of {
  text = matchBracesAndBrackets(text);
  //pretty print
  text = prettyPrintJson(text);

  return text.replaceAll(' at ', ' \nat ');
  //seperate stack trace items

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

export function extractJsonFromLog(text: string) {
  if (LOG_HEADER.test(text)) {
    return prettyPrintJson(text.replaceAll(LOG_HEADER, "")
      .replaceAll(/^\n/gm, ""));
  }
  vscode.window.showInformationMessage("Clipboard does not contain json.");
  return text;
}