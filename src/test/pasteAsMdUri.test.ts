import * as assert from 'assert';
import * as vscode from 'vscode';
import { createMocks, getClipboardResponse, restoreMocks } from './clipboardMock';

import { pasteAsMdUri } from '../pasteActions';

const webUri = `https://en.wikipedia.org/wiki/The_Notwist`;
const webUriResp = `[The_Notwist](https://en.wikipedia.org/wiki/The_Notwist)`;
const fileUri = `/Users/marcdoucet/Downloads/backup-ER605-2024-09-14.bin`;
const fileUriResp = `[backup-ER605-2024-09-14.bin](file:///Users/marcdoucet/Downloads/backup-ER605-2024-09-14.bin)`;

suite('pasteComparatorReport Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    const testCases = [
        {
            description: 'givenProperWebUri_WhenPasteAsMdUri_ThenSuccess',
            clipboardContent: webUri,
            expectedOutput: webUriResp,
        },
        {
            description: 'givenProperFileUri_WhenPasteAsMdUri_ThenNoTransformation',
            clipboardContent: fileUri,
            expectedOutput: fileUriResp,
        },
        {
            description: 'givenImproperWebUri_WhenPasteAsMdUri_ThenSuccess',
            clipboardContent: webUriResp,
            expectedOutput: webUriResp,
        },
        {
            description: 'givenImproperFileUri_WhenPasteAsMdUri_ThenNoTransformation',
            clipboardContent: fileUriResp,
            expectedOutput: fileUriResp,
        }
    ];

    testCases.forEach(({ description, clipboardContent, expectedOutput }) => {
        test(description, async () => {
            const insertSpy = createMocks(clipboardContent);

            try {
                // Call the function
                await pasteAsMdUri();
                const insertedContent = getClipboardResponse(insertSpy);
                assert.strictEqual(insertedContent.trim(), expectedOutput, 'Inserted content mismatch');
            } finally {
                // Restore all stubs
                restoreMocks();
            }
        });
    });
});
