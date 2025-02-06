import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { extractJsonFromLog } from "../pasteActions";
let log = `abc def ghi jkl | {
abc def ghi jkl | 
abc def ghi jkl |   "logReference": "EXT-0002-012345567-fghjkl",
abc def ghi jkl | 
abc def ghi jkl |   "command": "write",
abc def ghi jkl | 
abc def ghi jkl |   "rootId": "e738d081-b096-4329-b71b-baf7cf13bbd4",
abc def ghi jkl | 
abc def ghi jkl |   "errorDetails": {
abc def ghi jkl | 
abc def ghi jkl |     "code": "EXT-0002",
abc def ghi jkl | 
abc def ghi jkl |     "message": "Eror occured while...",
abc def ghi jkl | 
abc def ghi jkl |     "logReference": "EXT-0002-012345567-fghjkl",
abc def ghi jkl | 
abc def ghi jkl |     "errors": [
abc def ghi jkl | 
abc def ghi jkl |       {
abc def ghi jkl | 
abc def ghi jkl |         "code": "abc0001",
abc def ghi jkl | 
abc def ghi jkl |         "message": "Client request failed because...",
abc def ghi jkl | 
abc def ghi jkl |         "logReference": "abc0001-12345567-qweeteu",
abc def ghi jkl | 
abc def ghi jkl |         "errors": null
abc def ghi jkl | 
abc def ghi jkl |       }
abc def ghi jkl | 
abc def ghi jkl |     ],
abc def ghi jkl | 
abc def ghi jkl |     "field": null,
abc def ghi jkl | 
abc def ghi jkl |     "path": null,
abc def ghi jkl | 
abc def ghi jkl |     "details": null
abc def ghi jkl | 
abc def ghi jkl |   },
abc def ghi jkl | 
abc def ghi jkl |   "requestId": null
abc def ghi jkl | 
abc def ghi jkl | }`;

let logResp = `{
  "logReference": "EXT-0002-012345567-fghjkl",
  "command": "write",
  "rootId": "e738d081-b096-4329-b71b-baf7cf13bbd4",
  "errorDetails": {
    "code": "EXT-0002",
    "message": "Eror occured while...",
    "logReference": "EXT-0002-012345567-fghjkl",
    "errors": [
      {
        "code": "abc0001",
        "message": "Client request failed because...",
        "logReference": "abc0001-12345567-qweeteu",
        "errors": null
      }
    ],
    "field": null,
    "path": null,
    "details": null
  },
  "requestId": null
}`;


suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('proper log', () => {
        assert.strictEqual(extractJsonFromLog(log), logResp);
    });

    test('improper log', () => {
      assert.strictEqual(extractJsonFromLog(logResp), logResp);
  });

});