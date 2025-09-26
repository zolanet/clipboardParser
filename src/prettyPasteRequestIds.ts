import * as vscode from "vscode";
import { RequestIdProcessor } from './RequestIdProcessor.js';
// Requirements
//Remove duplicates
export async function prettyPasteRequestIds() {
	let text = await getClipboard();
	writeToCurrentEditor(generate(text));
}
/* --- "Private Functions here" --- */

// TODO This should be in a helper module
async function getClipboard() {
	return await vscode.env.clipboard.readText();
}
// TODO This should be in a helper module
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

function generate(text: string) {
	let cleanText = text
		.split("\n")
		.map(line => new RequestIdProcessor(line)
			.removeAppostrophes()
			.splitTestCase()
			.formatComponentId()
			.replaceAllUnderscores()
			.removeTailingUuid()
			.splitTestCaseId()
			.getLine()
		)
		.join("\n");

	return removeDuplicates(cleanText);
}

function removeDuplicates(text: string) {
	let list = text.split("\n");
	const H2 = /^## /;
	const H3 = /^### /;
	const H4 = /^#### /;

	const seen = {
		testCase: new Set(),
		fileName: new Set(),
		testCaseId: new Set()
	};
	const newList: string[] = [];

	list.forEach(item => {
		if (H2.test(item)) {
			if (!seen.testCase.has(item)) {
				seen.testCase.add(item);
				newList.push(item);
				seen.fileName.clear();
				seen.testCaseId.clear();
			}
		} else if (H3.test(item)) {
			if (!seen.fileName.has(item)) {
				seen.fileName.add(item);
				newList.push(item);
			}
		} else if (H4.test(item)) {
			if (!seen.testCaseId.has(item)) {
				seen.testCaseId.add(item);
				newList.push(item);
			}
		} else {
			newList.push(item);
		}
	});

	return newList;
}