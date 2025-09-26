// Requirements
// given : property-test-case-2025.09.25-06-00.31.496-C_3_4_101_test_name_functional_l3_testcase_10_12345678
//1- remove " if any
//2- split test-case 
//3- remove date
//4- replace functional id _ with .
//5- replace all _ with -
//6- remove tail uuid
//7- spilt tescase
//8- split stepid
export class RequestIdProcessor {
    private line: string;
    constructor(line: string) {
        this.line = line;
    }

    removeAppostrophes() {
        this.line = this.line.replaceAll("\"", "");
        return this;
    }

    splitTestCase() {
        const pattern = /(^.+-test-case)(-\d{4}\.\d{2}\.\d{2}-\d{2}-\d{2}\.\d{2}\.\d{3}-)/;
        this.line = this.line.replace(pattern, "## $1\n");
        return this;
    }

    formatComponentId() {
        const pattern = /(\w)_(\d)_(\d)_(\d{3})/;
        this.line = this.line.replace(pattern, "### $1.$2.$3.$4");
        return this;
    }

    replaceAllUnderscores() {
        this.line = this.line.replaceAll("_", "-");
        return this;
    }

    removeTailingUuid() {
        const pattern = /-[a-z0-9]{8}$/;
        this.line = this.line.replace(pattern, "");
        return this;
    }

    splitTestCaseId() {
        const patternPre = /(functional(-l2|-l3)?)-/;
        const patternPost = /-(\d*$)/;
        this.line = this.line.replace(patternPre, "$1\n#### ").replace(patternPost, "\n- $1");
        return this;
    }

    getLine() {
        return this.line;
    }
}

