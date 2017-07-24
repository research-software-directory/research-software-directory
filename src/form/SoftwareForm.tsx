import * as React from 'react';

import {ControlLabel, FormControl} from 'react-bootstrap';

// tslint:disable-next-line:no-require-imports no-var-requires
// const Select = require('react-select');

import * as ReactSelect from 'react-select';

import 'react-select/dist/react-select.css';

import {connect} from 'react-redux';

const enums = {
  programmingLanguages: [
    'C++',
    'Python',
    'etc'
  ]
};

/**
 * merges non-empty values of `b` that are not in `a` with `a`
 *
 * @param {string[]} a enum1
 * @param {(string[] | null)} b
 * @returns merge of a and b
 */
const mergeEnums = (a: string[], b: string[] | null) => {
  return a.concat(b && b.filter(
    (lang: string) => lang !== '' && a.indexOf(lang) === -1
  ) || []);
};

const mapStateToProps = (state: any) => {
  console.log(state);
  console.log('test', state.data.software.map((software: any) => software.programmingLanguage)
    .reduce(mergeEnums, []));

  return state.data.software.map((software: any) => software.programmingLanguage);
};

const connector = connect(mapStateToProps, {});

class SoftwareFormComponent extends React.Component<{}, { schema: object, formData: any }> {
  componentWillMount() {
    this.setState({formData: {id: ''}});
  }

  updateFormValue(field: string, value: any) {
    this.setState({formData : {...this.state.formData, [field]: value}});
  }

  onReactSelectChange(field: string) {
    return (value: null|ReactSelect.Option|ReactSelect.Option[]) => {
      this.updateFormValue(field, value);
    };
  }

  onInputChange(field: string): React.FormEventHandler<React.Component<any>> {
    return (e: React.ChangeEvent<any>) => {
      this.updateFormValue(field, e.target.value);
    };
  }

  render() {
    return (
      <div style={{maxWidth: '400px'}}>

        <ControlLabel>ID</ControlLabel>
        <FormControl
          value={this.state.formData.id}
          onChange={this.onInputChange('id')}
        />

        <ControlLabel>Human-readable name</ControlLabel>
        <FormControl value={this.state.formData.name}/>

        <ControlLabel>Description</ControlLabel>
        <FormControl value={this.state.formData.description}/>

        <ControlLabel>tagLine</ControlLabel>
        <FormControl value={this.state.formData.tagLine}/>

        <ControlLabel>codeRepository</ControlLabel>
        <FormControl value={this.state.formData.codeRepository}/>

        <ControlLabel>nlescWebsite</ControlLabel>
        <FormControl value={this.state.formData.nlescWebsite}/>

        <ControlLabel>documentationUrl</ControlLabel>
        <FormControl value={this.state.formData.website}/>

        <ControlLabel>downloadUrl</ControlLabel>
        <FormControl value={this.state.formData.downloadUrl}/>

        <ControlLabel>logo</ControlLabel>
        <FormControl value={this.state.formData.logo}/>

        <ControlLabel>website</ControlLabel>
        <FormControl value={this.state.formData.website}/>

        <ControlLabel>website</ControlLabel>
        <FormControl value={this.state.formData.website}/>

        <ControlLabel>programmingLanguages</ControlLabel>
        <ReactSelect
          options={enums.programmingLanguages.map((lang) => ({ label: lang, value: lang}))}
          multi={true}
          value={this.state.formData.programmingLanguages}
          onChange={this.onReactSelectChange('programmingLanguages')}
        />
      </div>
    );
  }
}

export const SoftwareForm = connector(SoftwareFormComponent);
