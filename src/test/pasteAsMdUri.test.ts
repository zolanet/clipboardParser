import * as vscode from 'vscode';
import { runTest } from './clipboardMock';
import { pasteAsMdUri } from '../pasteActions';

const webUri = `https://en.wikipedia.org/wiki/The_Notwist`;
const webUriResp = `[The_Notwist](https://en.wikipedia.org/wiki/The_Notwist)`;
const fileUri = `/Users/marcdoucet/Downloads/backup-ER605-2024-09-14.bin`;
const fileUriResp = `[backup-ER605-2024-09-14.bin](file:///Users/marcdoucet/Downloads/backup-ER605-2024-09-14.bin)`;
const prUri = `https://dev.azure.com/organization/project/_git/repo/pullrequest/1234`;
const prUriResp = `[PR](https://dev.azure.com/organization/project/_git/repo/pullrequest/1234)`;

suite('pasteComparatorReport Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');


    test('givenProperWebUri_WhenPasteAsMdUri_ThenSuccess', async () => {
        await runTest(pasteAsMdUri, webUri, webUriResp);
    });

    test('givenProperFileUri_WhenPasteAsMdUri_ThenNoTransformation', async () => {
        await runTest(pasteAsMdUri, fileUri, fileUriResp);
    });

    test('givenImproperWebUri_WhenPasteAsMdUri_ThenSuccess', async () => {
        await runTest(pasteAsMdUri, webUriResp, webUriResp);
    });

    test('givenImproperFileUri_WhenPasteAsMdUri_ThenNoTransformation', async () => {
        await runTest(pasteAsMdUri, fileUriResp, fileUriResp);
    });

    test('givenProperPrUri_WhenPasteAsMdUri_ThenSuccess', async () => {
        await runTest(pasteAsMdUri, prUri, prUriResp);
    });

    test('givenImproperPrUri_WhenPasteAsMdUri_ThenNoTransformation', async () => {
        await runTest(pasteAsMdUri, prUriResp, prUriResp);
    });
});