import * as React from 'react';

import {ControlLabel, FormControl} from 'react-bootstrap';

// import * as ReactSelect from 'react-select';
// using require syntax to load without Typescript definitions, which are missing props
// tslint:disable-next-line:no-require-imports no-var-requires
const ReactSelect = require('react-select');

import 'react-select/dist/react-select.css';

import {connect} from 'react-redux';

const mapStateToProps = (state: any) => {
  return {
    schema: state.schema
  };
};

const connector = connect(mapStateToProps, {});

class SoftwareFormComponent extends React.Component<{ schema: any }, any> {
  componentWillMount() {
    this.setState({id: ''});
  }

  updateFormValue(field: string, value: any) {
    this.setState({...this.state, [field]: value});
  }

  onReactSelectChange(field: string) {
    return (value: any[]) => {
      if (value.length > 0) {
        const lastElm = value.slice(-1)[0];
        if (lastElm.className && lastElm.className === 'Select-create-option-placeholder') {
          const newOption = { ...value.splice(-1)[0] };
          delete newOption.className;
          this.updateFormValue(field, [...value, newOption]);
        } else {
          this.updateFormValue(field, value);
        }
      }
    };
  }

  onInputChange(field: string): React.FormEventHandler<React.Component<any>> {
    return (e: React.ChangeEvent<any>) => {
      this.updateFormValue(field, e.target.value);
    };
  }

  schemaEnum(type: string, fieldName: string): string[] {
    const field = this.props.schema[type].properties[fieldName];

    return (field.type === 'array') ? (field.items.enum || []) : (field.enum || []);
  }

  render() {
    return (
      <div style={{maxWidth: '400px'}}>

        <ControlLabel>ID</ControlLabel>
        <FormControl
          value={this.state.id}
          onChange={this.onInputChange('id')}
        />

        <ControlLabel>Human-readable name</ControlLabel>
        <FormControl value={this.state.name}/>

        <ControlLabel>Description</ControlLabel>
        <FormControl value={this.state.description}/>

        <ControlLabel>tagLine</ControlLabel>
        <FormControl value={this.state.tagLine}/>

        <ControlLabel>codeRepository</ControlLabel>
        <FormControl value={this.state.codeRepository}/>

        <ControlLabel>nlescWebsite</ControlLabel>
        <FormControl value={this.state.nlescWebsite}/>

        <ControlLabel>documentationUrl</ControlLabel>
        <FormControl value={this.state.website}/>

        <ControlLabel>downloadUrl</ControlLabel>
        <FormControl value={this.state.downloadUrl}/>

        <ControlLabel>logo</ControlLabel>
        <FormControl value={this.state.logo}/>

        <ControlLabel>website</ControlLabel>
        <FormControl value={this.state.website}/>

        <ControlLabel>website</ControlLabel>
        <FormControl value={this.state.website}/>

        <ControlLabel>programmingLanguages</ControlLabel>
        <ReactSelect.Creatable
          options={this.schemaEnum('software', 'programmingLanguage').map((lang) => ({ label: lang, value: lang}))}
          multi={true}
          value={this.state.programmingLanguage}
          onChange={this.onReactSelectChange('programmingLanguage')}
        />
      </div>
    );
  }
}

export const SoftwareForm = connector(SoftwareFormComponent);
