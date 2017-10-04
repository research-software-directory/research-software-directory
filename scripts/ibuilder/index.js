const BASE_URL = 'https://raw.githubusercontent.com/NLeSC/research-software-directory-backend/master/schema';
const request = require("request");
const converter = require('json-schema-to-typescript');
const fs = require('fs');

const tsLintDisable = '// tslint:disable\n';
const regexpExport = /\nexport.*?\n/;
const resources = ['software', 'project', 'publication', 'organization', 'person'];

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

resources.forEach(resource =>
    request({
        url: BASE_URL + `/${resource}.json`
    }, (error, response, body) => {
        converter
            .compile(JSON.parse(body), resource.capitalize())
            .then(result => {
                const output = tsLintDisable +
                    result.replace(regexpExport, `\nexport interface I${resource.capitalize()} {\n`);

                fs.writeFile(`../../src/interfaces/${resource}.ts`, output, err => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        console.log('wrote ' + resource + '.ts')
                    }
                });
            });
    }
));