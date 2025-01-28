import * as vscode from "vscode";
import { pasteAsMdUri, pasteEtcsFilenames, pasteComparatorReport } from "./pasteActions";

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

  const pastepasteComparatorReport = vscode.commands.registerCommand(
    "clipboard-parser.pasteComparatorReport",
    () => {
      pasteComparatorReport();
    }
  );

  context.subscriptions.push(pasteAsMdUriCommand, pasteFilenamesCommand);
}

export function deactivate() {}
