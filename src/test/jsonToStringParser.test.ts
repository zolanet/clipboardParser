import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { extractLogParts } from "../pasteActions";

let strignifiedJson = `a.b.c.d.ApplicationNAmeLogger - 
    logReference='EXT-0002-012345567-fghjkl',
    command='write',
    rootId=e738d081-b096-4329-b71b-baf7cf13bbd4,
    errorDetails=ErrorHolder{code='EXT-0002',
    message='Eror occured while...',
    logReference='EXT-0002-012345567-fghjkl',
    errors=[
    ErrorHolder{
    code='abc0001',
    message='Client request failed because...',
    logReference='abc0001-12345567-qweeteu',
    errors=null}],
    field=null,
    path=null,
    details=null},
    stackTrace=java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) `;

let minifiedConsole = `a.b.c.d.ApplicationNAmeLogger - logReference='EXT-0002-012345567-fghjkl', command='write', rootId=e738d081-b096-4329-b71b-baf7cf13bbd4, errorDetails=ErrorHolder{code='EXT-0002', message='Eror occured while...', logReference='EXT-0002-012345567-fghjkl', errors=[ ErrorHolder{ code='abc0001', message='Client request failed because...', logReference='abc0001-12345567-qweeteu', errors=null}], field=null, path=null, details=null}, stackTrace=java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 more, requestId=null`;
let minifiedConsoleUnfinished = `a.b.c.d.ApplicationNAmeLogger - logReference='EXT-0002-012345567-fghjkl', command='write', rootId=e738d081-b096-4329-b71b-baf7cf13bbd4, errorDetails=ErrorHolder{code='EXT-0002', message='Eror occured while...', logReference='EXT-0002-012345567-fghjkl', errors=[ ErrorHolder{ code='abc0001', message='Client request failed because...', logReference='abc0001-12345567-qweeteu', errors=null}], field=null, path=null, details=null}, stackTrace=java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 morerequestId=null  `; //morerequestId is real
let minifiedDLq = `a.b.c.d.ApplicationNAmeLogger - message handling has failed, message goes to dlq com.something.ither.dlq.impl.common.dlqErrorHolderFactory$DeadLeatterQueueHolderException: First message arrived to DLQ created with key: { "logReference": "EXT-0002-012345567-fghjkl", "command": "write", "rootId": "e738d081-b096-4329-b71b-baf7cf13bbd4", "errorDetails": { "code": "EXT-0002", "message": "Eror occured while...", "logReference": "EXT-0002-012345567-fghjkl", "errors": [ { "code": "abc0001", "message": "Client request failed because...", "logReference": "abc0001-12345567-qweeteu", "errors": null } ], "field": null, "path": null, "details": null } }, error Technical errorCaused by: com.something.other.app.CommandPublisherException: Technical error at java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;
let noJsonLog = `a.b.c.d.ApplicationNAmeLogger - Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;

let minifiedConsoleResp = `a.b.c.d.ApplicationNAmeLogger - {
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
  "stackTrace": "java.lang.Exception: Error occured while... 
at com.example.demo.service.DemoService.write(DemoService.java:74) 
at java.base/java.util.Optional.map(Optional.java:260) ... 21 more",
  "requestId": null
}`;

let minifiedDLqResp = `a.b.c.d.ApplicationNAmeLogger - message handling has failed, message goes to dlq com.something.ither.dlq.impl.common.dlqErrorHolderFactory$DeadLeatterQueueHolderException: First message arrived to DLQ created with key: {
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
  }
}, error Technical errorCaused by: com.something.other.app.CommandPublisherException: Technical error 
at java.lang.Exception: Error occured while... 
at com.example.demo.service.DemoService.write(DemoService.java:74) 
at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;

let strignifiedJsonResp = `a.b.c.d.ApplicationNAmeLogger - 
    {
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
  "stackTrace": "java.lang.Exception: Error occured while... 
at com.example.demo.service.DemoService.write(DemoService.java:74) 
at java.base/java.util.Optional.map(Optional.java:260"
}`;

let noJsonLogResp = `a.b.c.d.ApplicationNAmeLogger - Error occured while... 
at com.example.demo.service.DemoService.write(DemoService.java:74) 
at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;


suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('minifiedConsole', () => {
        assert.strictEqual(extractLogParts(minifiedConsole), minifiedConsoleResp);
    });

    test('minifiedConsoleUnfinished', () => {
        assert.strictEqual(extractLogParts(minifiedConsoleUnfinished), minifiedConsoleResp);
    });

    test('minifiedDLq', () => {
        assert.strictEqual(extractLogParts(minifiedDLq), minifiedDLqResp);
    });

    test('noJsonLog', () => {
        assert.strictEqual(extractLogParts(noJsonLog), noJsonLogResp);
    });
    test('strignifiedJson', () => {
        assert.strictEqual(extractLogParts(strignifiedJson), strignifiedJsonResp);
    });
});