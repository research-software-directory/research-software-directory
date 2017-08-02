import * as React from 'react';
// import { Option } from 'react-select';
// import { AddableReactSelect } from './components/AddableReactSelect';
import { IOption, MultiSelect } from './components/MultiSelect';

import { ResourceArray } from './components/ResourceArray';
import { StringArray } from './components/StringArray';
import { TextInput } from './components/TextInput';

import { TestAny } from './components/TestAny';

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

  onNewOption = (resourceType: string, field: string) => (option: IOption) => {
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
      const options = this.schemaEnum(this.props.resourceType, key).map((option) =>
            ({ label: option, value: option, key: option}));

      return (
        <MultiSelect
          key={key}
          label={field.description}
          value={this.props.data[key] || []}
          options={options}
          multi={true}
          search={true}
          addable={true}
          onChange={this.updateFormValue(key)}
          onNewOption={this.onNewOption(this.props.resourceType, key)}
        />

      );
    } else if (field.type === 'array' && 'items' in field && 'resType' in field.items) {
      return (
        <ResourceArray
          key={key}
          resourceType={field.items.resType.slice(1)}
          label={field.description}
          value={this.props.data[key] || []}
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

  alphabetSort = (a: string, b: string) => a.localeCompare(b);

  renderFields = (schema: any) =>
    Object.keys(schema.properties).sort(this.alphabetSort)
      .map((key: string) => this.renderField(key, schema.properties[key]))

  render() {
    return (
      <div className="main_form">

        <TestAny />

        {JSON.stringify(this.props.data || 'asdas')}
        {this.props.id}
        <button onClick={this.compareStuff} >Compare stuff</button>
        {this.renderFields(this.props.schema[this.props.resourceType])}
      </div>
    );
  }
}

export const ResourceForm = connector(ResourceFormComponent);
