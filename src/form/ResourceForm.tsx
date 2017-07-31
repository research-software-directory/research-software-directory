import * as React from 'react';
import { Option } from 'react-select';
import { AddableReactSelect } from './components/AddableReactSelect';

import { StringArray } from './components/StringArray';
import { TextInput } from './components/TextInput';

// tslint:disable-next-line:no-require-imports no-var-requires
const deepDiff = require('deep-diff').default;

import { connect } from 'react-redux';

import { addToSchemaEnum, updateField } from './actions';

import './style.css';

const mapDispatchToProps = {
  addToSchemaEnum,
  updateField
};

const mapStateToProps  = (state: any, props: IOwnProps) => {
  return ({
    data: state.current.data[props.resourceType].find(
      (resource: any) => resource.id === `${props.id}`
    ),
    oldData: state.data[props.resourceType].find(
      (resource: any) => resource.id === `${props.id}`
    ),
    oldSchema: state.schema,
    schema: state.current.schema
  });
};

interface IProps {
    schema: any;
    oldSchema: any;
    data: any;
    oldData: any;
    addToSchemaEnum: typeof addToSchemaEnum;
    updateField: typeof updateField;
}

interface IOwnProps {
  resourceType: string;
  id: string;
}

const connector = connect(mapStateToProps, mapDispatchToProps);

class ResourceFormComponent extends React.Component<IProps & IOwnProps, any> {
  componentWillMount() {
    // this.setState({id: '', programmingLanguage: []});
  }

  updateFormValue = (field: string) => (value: any) => {
    this.props.updateField(this.props.resourceType, this.props.id, field, value);
  }

  updateFormOptionsValue = (field: string) => (options: Option[]) => {
    this.updateFormValue(field)(options.map((val) => val.value));
  }

  onNewOption = (resourceType: string, field: string) => (option: Option) => {
    this.props.addToSchemaEnum(resourceType, field, option.value as string );
  }

  onInputChange(field: string): React.FormEventHandler<React.Component<any>> {
    return (e: React.ChangeEvent<any>) => {
      this.updateFormValue(field)(e.target.value);
    };
  }

  arrayToObjectById = (arr: any[]) => {
    return Object.assign({}, ...arr.map((obj) => ({[obj.id] : obj}) ));
  }

  compareStuff = () => {
    console.log(deepDiff(this.props.oldSchema, this.props.schema));
  }

  schemaEnum(type: string, fieldName: string): string[] {
    const field = this.props.schema[type].properties[fieldName];

    return (field.type === 'array') ? (field.items.enum || []) : (field.enum || []);
  }

  hasChanged(field: string) {
    return !!deepDiff(this.props.data[field] || null, this.props.oldData[field] || null);
  }

  renderField = (key: string, field: any): any => {
    if (field.type === 'string') {
      return (
        <TextInput
          key={key}
          value={this.props.data[key]}
          label={field.description}
          onChange={this.updateFormValue(key)}
          className={this.hasChanged(key) ? 'dirty' : ''}
        />
      );
    } else if (field.type === 'array' && 'items' in field && field.items.enum) {
      return (
        <AddableReactSelect
          key={key}
          label={field.description}
          options={this.schemaEnum(this.props.resourceType, key).map((option) => ({ label: option, value: option}))}
          multi={true}
          value={(this.props.data[key] || []).map((val: string) => ({value: val, label: val}))}
          onChange={this.updateFormOptionsValue(key)}
          onNewOption={this.onNewOption(this.props.resourceType, key)}
        />
      );
    } else if (field.type === 'array' && (!('items' in field) || !('enum' in field.items))) {
      return (
        <StringArray
          key={key}
          label={field.description}
          value={(this.props.data[key] || [])}
          onChange={this.updateFormValue(key)}
        />
      );
    } else {
      return (<div key={key}>{key} {JSON.stringify(field)}</div>);
    }
  }

  renderFields = (schema: any) =>
    Object.keys(schema.properties).map((key: string) => this.renderField(key, schema.properties[key]))

  render() {
    return (
      <div className="main_form">
        {JSON.stringify(this.props.data || 'asdas')}
        {this.props.id}
        <button onClick={this.compareStuff} >Compare stuff</button>
        {this.renderFields(this.props.schema[this.props.resourceType])}
      </div>
    );
  }
}

export const ResourceForm = connector(ResourceFormComponent);
