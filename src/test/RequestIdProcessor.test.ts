import * as vscode from 'vscode';
import * as assert from 'assert';
import { RequestIdProcessor } from '../RequestIdProcessor';

suite('RequestProcessor Test', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('removeAppostrophes', async () => {
		const line = '"property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_10_12345678"';
		const expected = 'property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_10_12345678';
		const requestIdProcessor = new RequestIdProcessor(line);
		assert.equal(requestIdProcessor.removeAppostrophes().getLine(), expected);
	});

	test('splitTestCase', async () => {
		const line = 'property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_10_12345678';
		const expected = '## property-test-case\nC_3_4_101_test_name_functional_l3_testcase_10_12345678';
		const requestIdProcessor = new RequestIdProcessor(line);
		assert.equal(requestIdProcessor.splitTestCase().getLine(), expected);
	});

	test('formatComponentId', async () => {
		const line = 'C_3_4_101_test_name_functional_l3_testcase_10_12345678';
		const expected = '### C.3.4.101_test_name_functional_l3_testcase_10_12345678';
		const requestIdProcessor = new RequestIdProcessor(line);
		assert.equal(requestIdProcessor.formatComponentId().getLine(), expected);
	});

	test('replaceAllUnderscores', async () => {
		const line = 'C.3.4.101_test_name_functional_l3_testcase_10_12345678';
		const expected = 'C.3.4.101-test-name-functional-l3-testcase-10-12345678';
		const requestIdProcessor = new RequestIdProcessor(line);
		assert.equal(requestIdProcessor.replaceAllUnderscores().getLine(), expected);
	});

	test('removeTailingUuid', async () => {
		const line = 'C.3.4.101-test-name-functional-l3-testcase-10-12345678';
		const expected = 'C.3.4.101-test-name-functional-l3-testcase-10';
		const requestIdProcessor = new RequestIdProcessor(line);
		assert.equal(requestIdProcessor.removeTailingUuid().getLine(), expected);
	});

	test('splitTestCaseId', async () => {
		const line = 'C.3.4.101-test-name-functional-l3-testcase-10';
		const expected = 'C.3.4.101-test-name-functional-l3\n#### testcase\n- 10';
		const requestIdProcessor = new RequestIdProcessor(line);
		assert.equal(requestIdProcessor.splitTestCaseId().getLine(), expected);

		// 'C.3.4.101-test-name-functional-l3\n#### testcase\n- 10' == 
		// 'C.3.4.101-test-name-functional-l3-\n#### testcase\n- 10'
	});
});