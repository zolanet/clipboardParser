import * as vscode from 'vscode';
import { runTest } from './clipboardMock';
import { pasteComparatorReport } from '../pasteActions';

//`test/bla/bla/bla/* c.4.4.100-something.json, MODIFIED, Disabled: 0 / 2, [-1.7, -1.50], TestCase Count: 1 / 1`;
const log = `│    c.4.4.100-something.json │ MODIFIED │ 0 / 2 │ 1 / 1 │
│     c.3.4.150-oneFifty.json    │ NEW │ 0 / 0 │ 12 / 13 │`;
const logResp = `- c.3.4.150-oneFifty.json; NEW; Disabled: 0 / 0; TestCases: 12 / 13
- c.4.4.100-something.json; MODIFIED; Disabled: 0 / 2; TestCases: 1 / 1`;


suite('pasteConsoleData Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('ivenProperLog_WhenPasteComparatorReport_ThenSuccess', async () => {
        await runTest(pasteComparatorReport, log, logResp);
    });

    test('givenImproperLog_WhenPasteComparatorReport_ThenNoTransformation', async () => {
        await runTest(pasteComparatorReport, logResp, logResp);
    });
});