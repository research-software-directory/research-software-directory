const request = require("requests");
const converter = require('json-schema-to-typescript');
const fs = require('fs-extra');
const path = require('path');

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

const tsLintDisable = '// tslint:disable\n';
const regexpExport = /\nexport.*?\n/;
const BASE_URL = process.env['SCHEMA_URL'];
const API_RESOURCE_URL = process.env['SCHEMA_LOCATIONS'];
const localPath = process.env['SCHEMA_LOCAL'];
const localPathExists = fs.existsSync(localPath);
const outputPath = path.join(__dirname, '..', '..', 'src', 'interfaces');

let resourceInterface = '';

if (localPathExists) { console.log('reading from local path ' + localPath); }

const jsonRequest = url => new Promise(resolve => {
        console.log(`getting ${url}...`);
        return request({
                url: url,
                headers: {'user-agent': 'node/requests'}
            }, (error, response, body) => {
                if (error) { throw(error); }
                if (!response) { throw('empty response') }
                if (response.statusCode !== 200) { throw 'status code '+response.statusCode }
                resolve(JSON.parse(body))
            }
        )
    }
);

const getSchemaFilenamesFromGithub = async() => {
    let url = API_RESOURCE_URL;
    if (process.env['GITHUB_ACCESS_TOKEN']) {
        url = `${url}?access_token=${process.env['GITHUB_ACCESS_TOKEN']}`;
    }
    const resp = await jsonRequest(url);
    return resp.map(file => file.name);
}
const getLocalSchemaFilenames = () => fs.readdir(localPath);

const processTSResult = async (resource, schema) => {
    const tsCode = await converter.compile(schema, resource.name.capitalize());
    const output = tsLintDisable +
        tsCode.replace(regexpExport, `\nexport interface I${resource.name.capitalize()} {\n`);

    await fs.writeFile(path.join(outputPath, 'resources', `${resource.name}.ts` ), output);

    console.log(`wrote interface ${resource.name}.ts`);

    for (let str of ['import', 'export']) {
        resourceInterface += `${str} {I${resource.name.capitalize()}} from './resources/${resource.name}';\n`;
    }
}

const processSchemas = async () => {
    const resourceFilenames = localPathExists ? await getLocalSchemaFilenames() : await getSchemaFilenamesFromGithub();
    const resources = resourceFilenames.filter(fileName => fileName.indexOf('.json') !== -1)
        .map(fileName => ({name: fileName.slice(0, -5), fileName}));

    await Promise.all(resources.map(async resource => {
        const schema = localPathExists
            ? JSON.parse(await fs.readFile(path.join(localPath, resource.fileName)))
            : await jsonRequest(`${BASE_URL}/${resource.fileName}`)

        await processTSResult(resource, schema);
    }));

    resourceInterface += `export type IResource = ` +
        resources.map(resource => `I${resource.name.capitalize()}`).join(' | ') + ';\n';
    resourceInterface += 'export type IResourceType = ' +
        resources.map(resource => `'${resource.name}'`).join(' | ') + ';\n';

    await fs.writeFile(path.join(outputPath, 'resource.ts'), resourceInterface);

    console.log('wrote interface resource.ts');
}

processSchemas().catch(error => setTimeout(() => { throw error; }));