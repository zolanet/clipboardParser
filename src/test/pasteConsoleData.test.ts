import * as vscode from 'vscode';
import { runTest} from './clipboardMock';
import { pasteConsoleData } from '../pasteActions';

const properConsoleData = `a.1.1.111-test-name-a.json	"test case a"
Test Cover a
1.1	app	domain	action	result
"error message a"
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
Test Cover b
2.2	app	domain	action	result
"error message a"
222	...	...	...	2	
`;

const properConsoleDataResp = `- a.1.1.111-test-name-a.json
  - "test case a"
  - 1.1 action
  \`\`\`bash
  "error message a"
  \`\`\`

- b.2.2.222-test-name-a.json
  - "test case b"
  - 2.2 action
  \`\`\`bash
  "error message a"
  \`\`\``;

const partialMatchConsoleData = `a.1.1.111-test-name-a.json	"test case a"
Test Cover a
1.1	app	domain	action	result
"error message a"
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
Test Cover b
`;

const partialMatchConsoleDataResp = `- a.1.1.111-test-name-a.json
  - "test case a"
  - 1.1 action
  \`\`\`bash
  "error message a"
  \`\`\`

- b.2.2.222-test-name-a.json
  - "test case b"
  -  undefined`;

const consoleDataWithNoErrorGroup = `a.1.1.111-test-name-a.json	"test case a"
Test Cover a
1.1	app	domain	action	result
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
Test Cover b
2.2	app	domain	action	result
"error message a"
222	...	...	...	2	
`;

const consoleDataWithNoErrorGroupResp = `- a.1.1.111-test-name-a.json
  - "test case a"
  - 1.1 action

- b.2.2.222-test-name-a.json
  - "test case b"
  - 2.2 action
  \`\`\`bash
  "error message a"
  \`\`\``;


const consoleDataWithoutTestCover = `a.1.1.111-test-name-a.json	"test case a"
1.1	app	domain	action	result
"error message a"
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
Test Cover b
2.2	app	domain	action	result
"error message a"
222	...	...	...	2	
`;

const consoleDataWithLongTestCover = `a.1.1.111-test-name-a.json	"test case a"
Test Cover a
1.1	app	domain	action	result
"error message a"
111	...	...	...	1	
b.2.2.222-test-name-a.json	"test case b"
"Test Cover b\nGiven\nWhen\nThen"
2.2	app	domain	action	result
"error message a"
222	...	...	...	2	
`;

suite('pasteConsoleData Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('givenProperTextThenResponseTransformProperly', async () => {
    await runTest(pasteConsoleData, properConsoleData, properConsoleDataResp);
  });

  test('givenPartialMatchThenResponseContainsPartialMatch', async () => {
    await runTest(pasteConsoleData, partialMatchConsoleData, partialMatchConsoleDataResp);
  });

  test('givenConsoleDataWithNoErrorGroupThenResponseTransformProperly', async () => {
    await runTest(pasteConsoleData, consoleDataWithNoErrorGroup, consoleDataWithNoErrorGroupResp);
  });

  test('givenConsoleDataWithoutTestCoverThenResponseTransformProperly', async () => {
    await runTest(pasteConsoleData, consoleDataWithoutTestCover, properConsoleDataResp);
  });

  test('givenConsoleDataWithLongTestCoverThenResponseTransformProperly', async () => {
    await runTest(pasteConsoleData, consoleDataWithLongTestCover, properConsoleDataResp);
  });
});