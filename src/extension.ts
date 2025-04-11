import * as vscode from "vscode";
import { pasteAsMdUri, pasteEtcsFilenames, pasteComparatorReport, prettyPasteStackTrace, prettyPasteLogs, pasteNonBreakSpace, pasteJsonFromErrorReport, pasteRequestIdsAsFiles, pasteConsoleData } from "./pasteActions";
import { toJira, toMd } from './jiraFormatConverter';

export function activate(context: vscode.ExtensionContext) {

  const pasteFilenamesCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteEtcsFilenames",
    () => {
      pasteEtcsFilenames();
    }
  );

  const pasteAsMdUriCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteAsMdUri",
    () => {
      pasteAsMdUri();
    }
  );

  const pastepasteComparatorReportCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteComparatorReport",
    () => {
      pasteComparatorReport();
    }
  );

  const prettyPasteStackTraceCommand = vscode.commands.registerCommand(
    "clipboard-parser.prettyPasteStackTrace",
    () => {
      prettyPasteStackTrace();
    }
  );

  const prettyPasteLogsCommand = vscode.commands.registerCommand(
    "clipboard-parser.prettyPasteLogs",
    () => {
      prettyPasteLogs();
    }
  );

  const pasteNonBreakSpaceCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteNonBreakSpace",
    () => {
      pasteNonBreakSpace();
    }
  );

  const pasteJsonFromErrorReportCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteJsonFromErrorReport",
    () => {
      pasteJsonFromErrorReport();
    }
  );

  const pasteRequestIdsAsFilesCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteRequestIdsAsFiles",
    () => {
      pasteRequestIdsAsFiles();
    }
  );

  const convertToJiraCommand = vscode.commands.registerCommand(
    "clipboard-parser.convertToJira",
    async () => {
      await toJira();
    }
  );

  const convertToMdCommand = vscode.commands.registerCommand(
    "clipboard-parser.convertToMd",
    async () => {
      await toMd();
    }
  );

  const pasteConsoleDataCommand = vscode.commands.registerCommand(
    "clipboard-parser.pasteConsoleData",
    async () => {
      await pasteConsoleData();
    }
  );


  context.subscriptions.push(pasteAsMdUriCommand, pasteFilenamesCommand, prettyPasteStackTraceCommand, pastepasteComparatorReportCommand, prettyPasteLogsCommand, pasteNonBreakSpaceCommand, pasteJsonFromErrorReportCommand, pasteRequestIdsAsFilesCommand, convertToJiraCommand, convertToMdCommand, pasteConsoleDataCommand);
}

export function deactivate() { }
