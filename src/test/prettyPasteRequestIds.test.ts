import * as vscode from 'vscode';
import { runTest } from './clipboardMock';
import { prettyPasteRequestIds } from "../prettyPasteRequestIds";

suite('Json To String Parser Test', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('prettyPasteRequestIds', async () => {
	await runTest(prettyPasteRequestIds, report, expected);
  });
});

const expected = `## property-test-case
### C.3.4.101-test-name-functional-l3
#### testcase
- 10
- 11
- 12
#### testcase2
- 20
## property-e2e-test-case
### C.3.4.101-test-name-functional-l3
#### testcase
- 10`;

const report = `property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_10_12345678
property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_11_12345678
property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_12_12345678
property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase2_20_12345678
property-e2e-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_10_12345678`;