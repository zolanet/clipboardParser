import * as vscode from "vscode";
import { pasteAsMdUri, pasteEtcsFilenames, pasteComparatorReport, prettyPasteStackTrace, prettyPasteLogs, pasteNonBreakSpace, pasteJsonFromErrorReport } from "./pasteActions";

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
  
  context.subscriptions.push(pasteAsMdUriCommand, pasteFilenamesCommand, prettyPasteStackTraceCommand, pastepasteComparatorReportCommand, prettyPasteLogsCommand, pasteNonBreakSpaceCommand, pasteJsonFromErrorReportCommand);
}

export function deactivate() { }
