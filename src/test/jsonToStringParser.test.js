const { JsxFlags } = require("typescript");

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

let minifiedConsole = `a.b.c.d.ApplicationNAmeLogger - logReference='EXT-0002-012345567-fghjkl', command='write', rootId=e738d081-b096-4329-b71b-baf7cf13bbd4, errorDetails=ErrorHolder{code='EXT-0002', message='Eror occured while...', logReference='EXT-0002-012345567-fghjkl', errors=[ ErrorHolder{ code='abc0001', message='Client request failed because...', logReference='abc0001-12345567-qweeteu', errors=null}], field=null, path=null, details=null}, stackTrace=java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;
let minifiedDLq = `a.b.c.d.ApplicationNAmeLogger - message handling has failed, message goes to dlq com.something.ither.dlq.impl.common.dlqErrorHolderFactory$DeadLeatterQueueHolderException: First message arrived to DLQ created with key: { "logReference": "EXT-0002-012345567-fghjkl", "command": "write", "rootId": "e738d081-b096-4329-b71b-baf7cf13bbd4", "errorDetails": { "code": "EXT-0002", "message": "Eror occured while...", "logReference": "EXT-0002-012345567-fghjkl", "errors": [ { "code": "abc0001", "message": "Client request failed because...", "logReference": "abc0001-12345567-qweeteu", "errors": null } ], "field": null, "path": null, "details": null } }, error Technical errorCaused by: com.something.other.app.CommandPublisherException: Technical error at java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;
let noJsonLog = `a.b.c.d.ApplicationNAmeLogger - Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260) ... 21 more`;

const UNQUOTED_KEY = /(\b\w+\b)(?=\=)/gm;
const UNQUOTED_VALUE = /(?<=\=)(\b(?!null|true|false|{).+\b)\)*/gm;
const INLINE_COMMA = /,(?!\n)/g;

//prettyPasteLogs(minifiedConsole);
//prettyPasteLogs(minifiedDLq);
//prettyPasteLogs(strignifiedJson);
prettyPasteLogs(noJsonLog);

function prettyPasteLogs(text) {
    // First, convert stringified object to json
    if (text.match(/=/gm)) {
        text = convertToProperObject(text);
    }
    //count number of {
    text = matchBracesAndBrackets(text);
    //pretty print
    text = prettyPrintJson(text);

    let output = text.replaceAll(' at ', ' \nat ');
    //seperate stack trace items

    console.log(output);
}

function matchBracesAndBrackets(text) {
    let openBraces = text.match(/{/g)?.length;
    let closeBraces = text.match(/}/g)?.length;
    // count number of [
    let openBrackets = text.match(/\[/g)?.length;
    let closeBrackets = text.match(/\]/g)?.length;
    //check if number of [ and ] are equal
    if (openBrackets !== closeBrackets) {
        text = text + ']';
    }
    //check if number of { and } are equal
    if (openBraces !== closeBraces) {
        text = text + '}';
    }
    return text;
}

function convertToProperObject(text) {
    let finalText = text
        .replace(INLINE_COMMA, ',\n')
        .replaceAll('ErrorHolder', '')
        .replaceAll(UNQUOTED_KEY, '"$1"')
        .replaceAll(UNQUOTED_VALUE, '"$1"')
        .replaceAll('\'', '"')
        .replaceAll('=', ':');
    let firstKey = finalText.search(/\".+?\":/);
    //check if first key is precede by {
    if (!/\{/.test(finalText.substring(0, firstKey))) {
        finalText = finalText.substring(0, firstKey) + '{' + finalText.substring(firstKey, finalText.length) + '}';
    }
    return finalText;

}
function prettyPrintJson(text) {
    let firstBrace = text.search(/{/);
    let lastBrace = text.search(/(?![^\}]*\})/);
    let betweenBraces = text.substring(firstBrace, lastBrace);
    let prettyJson = '';
    if(betweenBraces){
        try {
            prettyJson = JSON.stringify(JSON.parse(betweenBraces), null, 2);
        } catch (error) {
            console.log('Error parsing json');
            prettyJson = betweenBraces;
        }
        return text.replace(betweenBraces,prettyJson);
    }
    return text;
}