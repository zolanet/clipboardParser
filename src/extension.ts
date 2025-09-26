import * as vscode from "vscode";
import { pasteAsMdUri, 
  pasteEtcsFilenames, 
  pasteComparatorReport, 
  prettyPasteLogs, 
  pasteNonBreakSpace, 
  pasteRequestIdsAsFiles, 
  pasteConsoleData } from "./pasteActions";
import {prettyPasteRequestIds} from './prettyPasteRequestIds';
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

    const prettyPasteRequestIdsCommand = vscode.commands.registerCommand(
    "clipboard-parser.prettyPasteRequestIds",
    async () => {
      await prettyPasteRequestIds();
    }
  );


  context.subscriptions.push(pasteAsMdUriCommand, pasteFilenamesCommand, pastepasteComparatorReportCommand, prettyPasteLogsCommand, pasteNonBreakSpaceCommand, pasteRequestIdsAsFilesCommand, convertToJiraCommand, convertToMdCommand, pasteConsoleDataCommand);
}

export function deactivate() { }
