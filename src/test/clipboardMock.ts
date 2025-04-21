import * as sinon from 'sinon';
import * as vscode from 'vscode';
import * as assert from 'assert';

const stubs: sinon.SinonStub[] = [];

export function createMocks(clipboardText: string) {
    // Stub the clipboard
    const clipboardStub = sinon.stub(vscode.env, 'clipboard').value({ readText: async () => clipboardText });
    stubs.push(clipboardStub);

    // Mock the active editor
    const insertSpy = sinon.spy();
    const editorStub = sinon.stub(vscode.window, 'activeTextEditor').value({
        edit: sinon.stub().callsFake((callback: (editBuilder: any) => void) => {
            const editBuilder = { insert: insertSpy };
            callback(editBuilder);
            return Promise.resolve(true);
        }),
        selection: {
            active: new vscode.Position(0, 0),
        },
    });
    stubs.push(editorStub);

    return insertSpy;
}

export function setClipboardContent(clipboardText: string) {
    // Mock the VS Code editor and document behavior
    const editorStub = sinon.stub(vscode.window, 'activeTextEditor').value({
        document: {
            getText: sinon.stub().returns(clipboardText),
        },
        selection: {},
    });
    stubs.push(editorStub);
}

export function getClipboardResponse(insertSpy: sinon.SinonSpy<any[], any>) {
    // Combine all calls to insertSpy into a single string
    return insertSpy.getCalls()
        .map((call) => call.args[1]) // Extract the second argument (content)
        .join('');
}
export function restoreMocks() {
    // Restore all stubs
    stubs.forEach((stub) => stub.restore());
    stubs.length = 0; // Clear the stubs array
}

export async function runTest(
    testedFunction: () => Promise<void>,
    clipboardContent: string,
    expectedOutput: string
) {
    const insertSpy = createMocks(clipboardContent);

    try {
        // Call the tested function
        await testedFunction();
        const insertedContent = getClipboardResponse(insertSpy);
        assert.strictEqual(insertedContent.trim(), expectedOutput, 'Inserted content mismatch');
    } finally {
        // Restore all stubs
        restoreMocks();
    }
}