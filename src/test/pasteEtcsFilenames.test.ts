import * as assert from 'assert';
import * as vscode from 'vscode';
import { createMocks, getClipboardResponse, restoreMocks } from './clipboardMock';

import { pasteEtcsFilenames } from '../pasteActions';

const log = `test/bla/bla/bla/c.4.4.100-something.json | 2 ++
test/bla/bla/bla/c.3.4.150-oneFifty.json | 4 ++--
test/bla/bla/bla/c.4.4.100-something.json | 2 ++`;

const logResp = `- c.3.4.150-oneFifty.json
- c.4.4.100-something.json`;

suite('pasteEtcsFilenames Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    const testCases = [
        {
            description: 'givenProperLog_WhenPasteEtcsFilenames_ThenSuccess',
            clipboardContent: log,
            expectedOutput: logResp,
        },
        {
            description: 'givenImproperLog_WhenPasteEtcsFilenames_ThenNoTransformation',
            clipboardContent: logResp,
            expectedOutput: logResp,
        }
    ];

    testCases.forEach(({ description, clipboardContent, expectedOutput }) => {
        test(description, async () => {
            const insertSpy = createMocks(clipboardContent);

            try {
                // Call the function
                await pasteEtcsFilenames();
                const insertedContent = getClipboardResponse(insertSpy);
                assert.strictEqual(insertedContent.trim(), expectedOutput, 'Inserted content mismatch');
            } finally {
                // Restore all stubs
                restoreMocks();
            }
        });
    });
});
