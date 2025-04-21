import * as vscode from 'vscode';
import { runTest } from './clipboardMock';
import { prettyPasteLogs } from "../pasteActions";

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

const stackTrace = `Exception in thread "main" java.lang.RuntimeException: Something has gone wrong, aborting! at com.myproject.module.MyProject.badMethod(MyProject.java:22) at com.myproject.module.MyProject.oneMoreMethod(MyProject.java:18) at com.myproject.module.MyProject.anotherMethod(MyProject.java:14) at com.myproject.module.MyProject.someMethod(MyProject.java:10) at com.myproject.module.MyProject.main(MyProject.java:6)`;
const stackTraceResp = `Exception in thread "main" java.lang.RuntimeException: Something has gone wrong, aborting!
at com.myproject.module.MyProject.badMethod(MyProject.java:22)
at com.myproject.module.MyProject.oneMoreMethod(MyProject.java:18)
at com.myproject.module.MyProject.anotherMethod(MyProject.java:14)
at com.myproject.module.MyProject.someMethod(MyProject.java:10)
at com.myproject.module.MyProject.main(MyProject.java:6)`;

const jsonLog = `abc def ghi jkl | {
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
  
const jsonLogResp = `{
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


suite('Json To String Parser Test', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('minifiedConsole', async () => {
    await runTest(prettyPasteLogs, minifiedConsole, minifiedConsoleResp);
  });
  test('minifiedConsoleUnfinished', async () => {
    await runTest(prettyPasteLogs, minifiedConsoleUnfinished, minifiedConsoleResp);
  });
  test('minifiedDLq', async () => {
    await runTest(prettyPasteLogs, minifiedDLq, minifiedDLqResp);
  });
  test('noJsonLog', async () => {
    await runTest(prettyPasteLogs, noJsonLog, noJsonLogResp);
  });
  test('strignifiedJson', async () => {
    await runTest(prettyPasteLogs, strignifiedJson, strignifiedJsonResp);
  });
  test('stackTrace', async () => {
    await runTest(prettyPasteLogs, stackTrace, stackTraceResp);
  });
  test('jsonLog', async () => {
    await runTest(prettyPasteLogs, jsonLog, jsonLogResp);
  });
});