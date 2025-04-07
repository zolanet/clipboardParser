import * as assert from 'assert';
import * as vscode from 'vscode';
import { createMocks, getClipboardResponse, restoreMocks } from './clipboardMock';

import { pasteComparatorReport } from '../pasteActions';

const log = `test/bla/bla/bla/* c.4.4.100-something.json, MODIFIED, Disabled: 0 / 2, [-1.7, -1.50], TestCase Count: 1 / 1
test/bla/bla/bla/* c.3.4.150-oneFifty.json, NEW, Disabled: 0 / 0, [], TestCase Count: 12 / 13`;

const logResp = `- c.3.4.150-oneFifty.json, NEW, Disabled: 0 / 0, [], TestCase Count: 12 / 13
- c.4.4.100-something.json, MODIFIED, Disabled: 0 / 2, [-1.7, -1.50], TestCase Count: 1 / 1`;

suite('pasteComparatorReport Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    const testCases = [
        {
            description: 'givenProperLog_WhenPasteComparatorReport_ThenSuccess',
            clipboardContent: log,
            expectedOutput: logResp,
        },
        {
            description: 'givenImproperLog_WhenPasteComparatorReport_ThenNoTransformation',
            clipboardContent: logResp,
            expectedOutput: logResp,
        }
    ];

    testCases.forEach(({ description, clipboardContent, expectedOutput }) => {
        test(description, async () => {
            const insertSpy = createMocks(clipboardContent);

            try {
                // Call the function
                await pasteComparatorReport();
                const insertedContent = getClipboardResponse(insertSpy);
                assert.strictEqual(insertedContent.trim(), expectedOutput, 'Inserted content mismatch');
            } finally {
                // Restore all stubs
                restoreMocks();
            }
        });
    });
});
