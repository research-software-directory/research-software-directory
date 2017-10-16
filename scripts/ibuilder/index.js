const request = require("request");
const converter = require('json-schema-to-typescript');
const fs = require('fs-extra');
const path = require('path');

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

const tsLintDisable = '// tslint:disable\n';
const regexpExport = /\nexport.*?\n/;
const BASE_URL = 'https://raw.githubusercontent.com/NLeSC/research-software-directory-backend/master/property';
const API_RESOURCE_URL = 'https://api.github.com/repos/NLeSC/research-software-directory-backend/contents/property';
const localPath = path.join(__dirname, '..', '..', '..', 'research-software-directory-backend', 'schema');
const localPathExists = fs.existsSync(localPath);
const outputPath = path.join(__dirname, '..', '..', 'src', 'interfaces');

let resourceInterface = '';

if (localPathExists) { console.log('reading from local path ' + localPath); }

const jsonRequest = url => new Promise((resolve, reject) =>
    request({
        url: url,
        headers: {'user-agent': 'node/requests'}
    }, (error, response, body) =>
        resolve(JSON.parse(body))
    )
);

const getSchemaFilenamesFromGithub = () =>
    jsonRequest(API_RESOURCE_URL).then(resp => resp.map(file => file.name));
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

const process = async () => {
    const resourceFilenames = localPathExists ? await getLocalSchemaFilenames() : await getSchemaFilenamesFromGithub();
    const resources = resourceFilenames.map(fileName => ({name: fileName.slice(0,-5), fileName}));

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

process();