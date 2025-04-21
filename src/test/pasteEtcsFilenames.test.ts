import * as vscode from 'vscode';
import { runTest } from './clipboardMock';
import { pasteEtcsFilenames } from '../pasteActions';

const log = `test/bla/bla/bla/c.4.4.100-something.json | 2 ++
test/bla/bla/bla/c.3.4.150-oneFifty.json | 4 ++--
test/bla/bla/bla/c.4.4.100-something.json | 2 ++`;

const logResp = `- c.3.4.150-oneFifty.json
- c.4.4.100-something.json`;

suite('pasteEtcsFilenames Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('givenProperLog_WhenPasteEtcsFilenames_ThenSuccess', async () => {
        await runTest(pasteEtcsFilenames, log, logResp);
    });

    test('givenImproperLog_WhenPasteEtcsFilenames_ThenNoTransformation', async () => {
        await runTest(pasteEtcsFilenames, logResp, logResp);
    });
});
