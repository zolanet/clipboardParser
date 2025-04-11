import * as assert from 'assert';
import * as vscode from 'vscode';
import { createMocks, getClipboardResponse, restoreMocks } from './clipboardMock';
import { pasteConsoleData } from '../pasteActions';

const properConsoleData = `a.1.1.111-test-name-a.json	"test case a"
test-definition a
1.1	app	domain	action	result
"assertion a"
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
test-definition b
2.2	app	domain	action	result
"assertion a"
222	...	...	...	2	
`;

const properConsoleDataResp = `- a.1.1.111-test-name-a.json
	- "test case a"
	- 1.1 action
	\`\`\`bash
	"assertion a"
	\`\`\`

- b.2.2.222-test-name-a.json
	- "test case b"
	- 2.2 action
	\`\`\`bash
	"assertion a"
	\`\`\``;

const partialMatchConsoleData = `a.1.1.111-test-name-a.json	"test case a"
test-definition a
1.1	app	domain	action	result
"assertion a"
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
test-definition b
`;

const partialMatchConsoleDataResp = `- a.1.1.111-test-name-a.json
	- "test case a"
	- 1.1 action
	\`\`\`bash
	"assertion a"
	\`\`\``;

suite('pasteConsoleData Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	const testCases = [
		{
			description: 'givenProperTextThenResponseTransformProperly',
			clipboardContent: properConsoleData,
			expectedOutput: properConsoleDataResp
		},
		{
			description: 'givenPartialMatchThenResponseContainsPartialMatch',
			clipboardContent: partialMatchConsoleData,
			expectedOutput: partialMatchConsoleDataResp
		}
	];

	testCases.forEach(({ description, clipboardContent, expectedOutput }) => {
		test(description, async () => {
			const insertSpy = createMocks(clipboardContent);

			try {
				// Call the function
				await pasteConsoleData();
				const insertedContent = getClipboardResponse(insertSpy);
				assert.strictEqual(insertedContent.trim(), expectedOutput, 'Inserted content mismatch');
			} finally {
				// Restore all stubs
				restoreMocks();
			}
		});
	});
});