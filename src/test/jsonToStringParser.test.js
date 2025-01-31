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

let minified = "a.b.c.d.ApplicationNAmeLogger - logReference='EXT-0002-012345567-fghjkl', command='write', rootId=e738d081-b096-4329-b71b-baf7cf13bbd4, errorDetails=ErrorHolder{code='EXT-0002', message='Eror occured while...', logReference='EXT-0002-012345567-fghjkl', errors=[ ErrorHolder{ code='abc0001', message='Client request failed because...', logReference='abc0001-12345567-qweeteu', errors=null}], field=null, path=null, details=null}, stackTrace=java.lang.Exception: Error occured while... at com.example.demo.service.DemoService.write(DemoService.java:74) at java.base/java.util.Optional.map(Optional.java:260)";
let jsonObject = {
    'logReference': 'EXT-0002-012345567-fghjkl',
    'command': 'write',
    'rootId': 'e738d081-b096-4329-b71b-baf7cf13bbd4',
    'errorDetails': {
        'ErrorHolder': {
            'code': 'EXT-0002',
            'message': 'Eror occured while...',
            'logReference': 'EXT-002012345567-fghjkl',
            'errors': [
                {
                    'ErrorHolder': {
                        'code': 'abc0001',
                        'message': 'Client request failed because...',
                        'logReference': 'abc0001-12345567-qweeteu',
                        'errors': null
                    }
                }
            ],
            'field': null,
            'path': null,
            'details': null
        }
    }
};
const UNQUOTED_KEY = /(\b\w+\b)(?=\=)/gm;
const UNQUOTED_VALUE = /(?<=\=)(\b(?!null|true|false|{).+\b)\)*/gm;
const LOGGER_ID = /^[a-z]\..+\s+-\s+/g;
const INLINE_COMMA = /,(?!\n)/g;

prettyPasteLogs(minified);

function prettyPasteLogs(text) {
    //remove logger id:
    let finalText = text
        .replace(INLINE_COMMA, ',\n')
        .replace(LOGGER_ID, '')
        .replaceAll('ErrorHolder', '')
        .replaceAll(UNQUOTED_KEY, '"$1"')
        .replaceAll(UNQUOTED_VALUE, '"$1"')
        .replaceAll('\'', '"')
        .replaceAll('=', ':')
        .replace(/^/, '{')
        .replace(/$/, '}');
    //pretty print
    let output = JSON.stringify(JSON.parse(finalText), null, 2).replaceAll(' at ', ' \nat ');
    //seperate stack trace items

    console.log(output);
}