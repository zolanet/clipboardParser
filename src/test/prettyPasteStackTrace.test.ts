import * as assert from 'assert';
import * as vscode from 'vscode';
import { createMocks, getClipboardResponse, restoreMocks } from './clipboardMock';

import { prettyPasteStackTrace } from '../pasteActions';

const stackTrace = `Exception in thread "main" java.lang.RuntimeException: Something has gone wrong, aborting! at com.myproject.module.MyProject.badMethod(MyProject.java:22) at com.myproject.module.MyProject.oneMoreMethod(MyProject.java:18) at com.myproject.module.MyProject.anotherMethod(MyProject.java:14) at com.myproject.module.MyProject.someMethod(MyProject.java:10) at com.myproject.module.MyProject.main(MyProject.java:6)`;
const stackTraceResp = `Exception in thread "main" java.lang.RuntimeException: Something has gone wrong, aborting!
 at com.myproject.module.MyProject.badMethod(MyProject.java:22)
 at com.myproject.module.MyProject.oneMoreMethod(MyProject.java:18)
 at com.myproject.module.MyProject.anotherMethod(MyProject.java:14)
 at com.myproject.module.MyProject.someMethod(MyProject.java:10)
 at com.myproject.module.MyProject.main(MyProject.java:6)`;

suite('pasteStackTrace Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  const testCases = [
    {
      description: 'givenProperStackTrace_WhenPrettyPasteStackTrace_ThenSuccess',
      clipboardContent: stackTrace,
      expectedOutput: stackTraceResp,
    },
    {
      description: 'givenImproperStackTrace_WhenPrettyPasteStackTrace_ThenNoTransformation',
      clipboardContent: stackTraceResp,
      expectedOutput: stackTraceResp,
    }
  ];

  testCases.forEach(({ description, clipboardContent, expectedOutput }) => {
    test(description, async () => {
      const insertSpy = createMocks(clipboardContent);

      try {
        // Call the function
        await prettyPasteStackTrace();
        const insertedContent = getClipboardResponse(insertSpy);
        assert.strictEqual(insertedContent.trim(), expectedOutput, 'Inserted content mismatch');
      } finally {
        // Restore all stubs
        restoreMocks();
      }
    });
  });
});