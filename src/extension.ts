import * as vscode from "vscode";
import { pasteAsMdUri, pasteEtcsFilenames } from "./pasteActions";

export function activate(context: vscode.ExtensionContext) {

  const pasteFilenamesCommand = vscode.commands.registerCommand(
    "clipboardParser.pasteEtcsFilenames",
    () => {
      pasteEtcsFilenames();
    }
  );

  const pasteAsMdUriCommand = vscode.commands.registerCommand(
    "clipboardParser.pasteAsMdUri",
    () => {
      pasteAsMdUri();
    }
  );

  context.subscriptions.push(pasteAsMdUriCommand, pasteFilenamesCommand);
}

export function deactivate() {}
