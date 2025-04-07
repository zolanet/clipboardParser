import * as assert from 'assert';
import * as vscode from 'vscode';
import { toJira, toMd } from '../jiraFormatConverter';
import {setClipboardContent, restoreMocks} from './clipboardMock';
const md = `# Hello World

This is a test of the **Markdown to Jira Wiki Syntax** converter.

## Features

- First level bullet
  - Second level bullet
    - Third level bullet
      - Fourth level bullet
- dashes-in-text-should-not-be-converted
- nore dashes in a math equation 30 - 10 = 20
- **Bold** text
- *Italic* text
- [Link](https://example.com)
- \`Inline code\`

\`\`\`javascript
function helloWorld() {
    console.log("Hello, world!");
}
\`\`\`

**This should be bold**

| header1 | header2 |
| --- | --- |
| row1col1 | row1col2 |
| row2col1 | row2col2 |`;

const jira = `h1. Hello World

This is a test of the *Markdown to Jira Wiki Syntax* converter.

h2. Features

* First level bullet
** Second level bullet
*** Third level bullet
**** Fourth level bullet
* dashes-in-text-should-not-be-converted
* nore dashes in a math equation 30 - 10 = 20
* *Bold* text
* _Italic_ text
* [Link|https://example.com]
* {{Inline code}}

{code:javascript}
function helloWorld() {
    console.log("Hello, world!");
}
{code}

*This should be bold*

|| header1 || header2 ||
| row1col1 | row1col2 |
| row2col1 | row2col2 |`;


suite('Jira Format Converter Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('givenProperMd_WhenToJira_ThenSucces', async () => {
        // Mock the VS Code editor and document behavior
       setClipboardContent(md);

        try {
            // Run the function and assert the result
            const result = await toJira();
            assert.strictEqual(result, jira);
        } finally {
            // Restore the original behavior after the test
            restoreMocks();
        }
    });

    test('givenProperJira_WhenToMd_ThenSucces', async () => {
        // Mock the VS Code editor and document behavior
        setClipboardContent(jira);

        try {
            // Run the function and assert the result
            const result = await toMd();
            assert.strictEqual(result, md);
        } finally {
            // Restore the original behavior after the test
            restoreMocks();
        }
    });
});