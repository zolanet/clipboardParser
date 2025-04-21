import * as vscode from 'vscode';
import { runTest } from './clipboardMock';
import { pasteRequestIdsAsFiles } from '../pasteActions';

const text = `property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4
property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68
property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4`;

const textWithDuplicates = `property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4
property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68
property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4
property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68`;

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

const textWithUppercase = `property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4
 property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_Integration_test_case_1_9d97dc68
 property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4`;

const csv = `Namespace,Time,AppName,RequestId,CorrelationId,UserId,Message,LogEntry
"ns","t"," an "," property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4 ","cid","uid","msg","le"
"ns","t"," an "," property-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisted_integration_test_case_1_9d97dc68 ","cid","uid","msg","le"
"ns","t"," an "," property-test-case-2025.03.21-08.00.00.000-B_3_3_300_ManageInteractionOperations_functional_test_case_1_e668a4e4 ","cid","uid","msg","le"`;

const textResp = `h2.property-e2e-test-case
* PerformDataGather-HO-CO-NEXTQA4251-Assisted-integration
** test-case-1
h2.property-test-case
* B.3.3.300-ManageInteractionOperations-functional
** test-case-1
* C.5.1.100-SubscribeAndManageInteractionOperations-functional
** test-case-1`;

const respWithMissingCategory = `h2.no-category
* L1Integrations-CreditScore-AAY0144-Assisted-integration
** test-case-1
h2.property-e2e-test-case
* PerformDataGather-HO-CO-NEXTQA4251-Assisted-integration
** test-case-1
h2.property-test-case
* B.3.3.300-ManageInteractionOperations-functional
** test-case-1
* C.5.1.100-SubscribeAndManageInteractionOperations-functional
** test-case-1`;

const respWithUnparsableLine = `h2.no-category
* no-test-file
** Unparseable-CreditScore-AAY0144-Assisted-test-case-1-9d97dc68
h2.property-e2e-test-case
* PerformDataGather-HO-CO-NEXTQA4251-Assisted-integration
** test-case-1
h2.property-test-case
* B.3.3.300-ManageInteractionOperations-functional
** test-case-1
* C.5.1.100-SubscribeAndManageInteractionOperations-functional
** test-case-1`;

const respWithUppercase = `h2.property-e2e-test-case
* PerformDataGather-HO-CO-NEXTQA4251-Assisted-Integration
** test-case-1
h2.property-test-case
* B.3.3.300-ManageInteractionOperations-functional
** test-case-1
* C.5.1.100-SubscribeAndManageInteractionOperations-functional
** test-case-1`;

suite('pasteRequestIdsAsFiles Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');
    test('givenProperTextThenResponseDoesNotContainDuplicates', async () => {
        await runTest(pasteRequestIdsAsFiles, text, textResp);
    });
    test('givenTextWithDuplicateValuesThenResponseDoesNotContainDuplicates', async () => {
        await runTest(pasteRequestIdsAsFiles, textWithDuplicates, textResp);
    });
    test('givenTextWithSpaceAtTheEndWhenExtractFilesFromRequesrIdThenSucces', async () => {
        await runTest(pasteRequestIdsAsFiles, textWithSpaceAtBothEnds, textResp);
    });
    test('givenCsvWhenextractFilesFromRequestIdThenSuccess', async () => {
        await runTest(pasteRequestIdsAsFiles, csv, textResp);
    });
    test('givenTextWithMissingCategoryPrefixWhenExtractFilesFromRequestIdThenSuccess', async () => {
        await runTest(pasteRequestIdsAsFiles, textWithMissingCategory, respWithMissingCategory);
    });
    test('givenTextWithUnparsabelLineWhenExtractFilesFromRequestIdThenSuccess', async () => {
        await runTest(pasteRequestIdsAsFiles, textWithUnparsableLine, respWithUnparsableLine);
    });
    test('givenTextWithUppercaseWhenExtractFilesFromRequestIdThenSuccess', async () => {
        await runTest(pasteRequestIdsAsFiles, textWithUppercase, respWithUppercase);
    });
});
