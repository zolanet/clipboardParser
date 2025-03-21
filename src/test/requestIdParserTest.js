let text = 'property-test-case-2025.03.21-08.00.00.000-C_5_1_100_SubscribeAndManageInteractionOperations_functional_test_case_1_e668a4e4\nproperty-e2e-test-case-2025.03.21-07.00.48.548-PerformDataGather_HO_CO_NEXTQA4251_Assisred_integration_test_case_1_9d97dc68\n';


let finalText = text
    .replace(/^\s*(.+)-\d{4}.+\d{3}-/gm, 'h2.$1\n* ')//split test-case prefix
    .replace(/_/g, '-')//Replace undurscor _ with -
    .replace(/(^\* [A-Z])-(\d+)-(\d+)-(\d+)/, '$1.$2.$3.$4')//format component id
    .replace(/(?<=-functional|-integration)-(.+)/gm, '\n** $1')//Split test case
    .replace(/-\w{8}\s*$/, '');// remove dlq suffix

    console.log(finalText);