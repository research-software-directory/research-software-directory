const BASE_URL = 'https://raw.githubusercontent.com/NLeSC/research-software-directory-backend/master/schema';
const request = require("request");
const converter = require('json-schema-to-typescript');
const fs = require('fs');
const path = require('path');

const tsLintDisable = '// tslint:disable\n';
const regexpExport = /\nexport.*?\n/;
const resources = ['software', 'project', 'publication', 'organization', 'person'];

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

const processTSResult = (resource, tsCode) => {
    converter
        .compile(JSON.parse(tsCode), resource.capitalize())
        .then(result => {
            const output = tsLintDisable +
                result.replace(regexpExport, `\nexport interface I${resource.capitalize()} {\n`);
            fs.writeFile(path.join(__dirname, '..', '..', 'src', 'interfaces', `${resource}.ts` ), output, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`wrote interface ${resource}.ts`);
                }
            });
        });
}

const localPath = path.join(__dirname, '..', '..', '..', 'research-software-directory-backend', 'schema');
const localPathExists = fs.existsSync(localPath);
if (localPathExists) { console.log('reading from local path ' + localPath); }

resources.forEach(resource => {
        localPathExists
            ? fs.readFile(path.join(localPath, `${resource}.json`), (err, data) =>
                processTSResult(resource, data) )
            : request({url: BASE_URL + `/${resource}.json`}, (error, response, body) =>
                processTSResult(resource, body) )
    }
);
