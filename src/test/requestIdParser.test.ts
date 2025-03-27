import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { extractFilesFromRequestId } from '../pasteActions';

let text = `property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4
property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68
property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4`;

const textWithMissingCategory = `property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4
property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68
property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4
0-L1Integrations_CreditScore_AAY0144_Assisted_integration_test_case_1_9d97dc68`;

const textWithUnparsableLine = `property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4
property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68
property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4
Unparseable_CreditScore_AAY0144_Assisted_test_case_1_9d97dc68`;

const textWithSpaceAtBothEnds = ` property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4 
 property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68 
 property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4 `;


let csv = `Namespace,Time,AppName,RequestId,CorrelationId,UserId,Message,LogEntry
"ns","t"," an "," property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4 ","cid","uid","msg","le"
"ns","t"," an "," property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68 ","cid","uid","msg","le"
"ns","t"," an "," property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4 ","cid","uid","msg","le"`;

let resp = [
    'h2.property-e2e-test-case',
    '* PerformDataGather-HO-CO-NEXTQA4251-Assisted-integration',
    '** test-case-1',
    'h2.property-test-case',
    '* B.3.3.300-ManageInteractionOperations-functional',
    '** test-case-1',
    '* C.5.1.100-SubscribeAndManageInteractionOperations-functional',
    '** test-case-1'
];

let respWithMissingCategory = [
    'h2.no-category',
    '* L1Integrations-CreditScore-AAY0144-Assisted-integration',
    '** test-case-1',
    'h2.property-e2e-test-case',
    '* PerformDataGather-HO-CO-NEXTQA4251-Assisted-integration',
    '** test-case-1',
    'h2.property-test-case',
    '* B.3.3.300-ManageInteractionOperations-functional',
    '** test-case-1',
    '* C.5.1.100-SubscribeAndManageInteractionOperations-functional',
    '** test-case-1'
];

let respWithUnparsableLine = [
    'h2.no-category',
    '* no-test-file',
    '** Unparseable-CreditScore-AAY0144-Assisted-test-case-1-9d97dc68',
    'h2.property-e2e-test-case',
    '* PerformDataGather-HO-CO-NEXTQA4251-Assisted-integration',
    '** test-case-1',
    'h2.property-test-case',
    '* B.3.3.300-ManageInteractionOperations-functional',
    '** test-case-1',
    '* C.5.1.100-SubscribeAndManageInteractionOperations-functional',
    '** test-case-1'
];


suite('Request Id Parser Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('requestIdList', () => {
        assert.strictEqual(extractFilesFromRequestId(text).join(','), resp.join(','));
    });

    test('givenTextWithSpaceAtTheEndWhenExtractFilesFromRequesrIdThenSucces', () => {
        assert.strictEqual(extractFilesFromRequestId(textWithSpaceAtBothEnds).join(','), resp.join(','));
    });

    test('givenCsvWhenextractFilesFromRequestIdThenSuccess', () => {
        assert.strictEqual(extractFilesFromRequestId(csv).join(','), resp.join(','));
    });

    test('givenTextWithMissingCategoryPrefixWhenExtractFilesFromRequestIdThenSuccess', () => {
        assert.strictEqual(extractFilesFromRequestId(textWithMissingCategory).join(','), respWithMissingCategory.join(','));
    });

    test('givenTextWithUnparsabelLineWhenExtractFilesFromRequestIdThenSuccess', () => {
        assert.strictEqual(extractFilesFromRequestId(textWithUnparsableLine).join(','), respWithUnparsableLine.join(','));
    });

});
