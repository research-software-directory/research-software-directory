import * as React from 'react';

import { IOption, MultiSelect } from './components/MultiSelect';

import { StringArray } from './components/StringArray';
import { TextInput } from './components/TextInput';

import { ResourceArray } from './components/ResourceArray';

import { connect } from 'react-redux';

import { addToSchemaEnum } from './actions';

const mapDispatchToProps = {
  addToSchemaEnum
};

const mapStateToProps: (state: any, props: IOwnProps) => any = (state: any) => {
  return ({
    data: state.current.data
  });
};

interface IProps {
  data: any;
  addToSchemaEnum: typeof addToSchemaEnum;
}

interface IOwnProps {
  fieldName: string;
  parentResourceType: string;
  schema: any;
  value: any;
  hasChanged: boolean;
  onChange(value: any): void;
}

const connector = connect(mapStateToProps, mapDispatchToProps);

class FormFieldComponent extends React.Component<IProps & IOwnProps & any, {}> {
  shouldComponentUpdate(nextProps: IProps&IOwnProps) {
    return (nextProps.value !== this.props.value)
        || (nextProps.schema !== this.props.schema);
  }

  onNewOption = (option: IOption) => {
    this.props.addToSchemaEnum(this.props.parentResourceType, this.props.fieldName, option.value as string );
  }

  schemaEnum(): string[] {
    return (this.props.schema.type === 'array') ? (this.props.schema.items.enum || []) : (this.props.schema.enum || []);
  }

  changeSingle = (val: any[]) => this.props.onChange(val ? val[0] : '');

  renderTextInput() {
    return (
      <TextInput
        value={this.props.value || ''}
        label={this.props.schema.description}
        onChange={this.props.onChange}
        className={this.props.hasChanged ? 'dirty' : ''}
      />
    );
  }

  renderMultiEnum() {
    const options = this.schemaEnum().map((option) =>
          ({ label: option, value: option, key: option}));

    return (
      <MultiSelect
        label={this.props.schema.description}
        value={this.props.value || []}
        options={options}
        multi={true}
        search={true}
        addable={true}
        onChange={this.props.onChange}
        onNewOption={this.onNewOption}
      />

    );

  }
  renderMultiResource() {
    const resourceType = this.props.schema.items.resType.split('/').slice(-1)[0];
    const options = this.props.data[resourceType].map((resource: any) => ({
      id: resource.id,
      label: resource.name || resource.id
    }));

    return (
      <ResourceArray
        label={this.props.schema.description}
        value={this.props.value || []}
        onChange={this.props.onChange}
        options={options}
        resourceType={resourceType}
        addable={false}
      />
    );
  }
  renderSingleResourceOrSimple() {
    let resourceType;
    for (const type of this.props.schema.anyOf) {
        if ('resType' in type) { resourceType = type.resType; }
    }
    resourceType = resourceType.split('/').slice(-1)[0];
    const options = this.props.data[resourceType].map((resource: any) => ({
      id: resource.id,
      label: resource.name || resource.id
    }));

    return (
      <ResourceArray
        label={this.props.schema.description}
        value={this.props.value ? [this.props.value] : []}
        onChange={this.changeSingle}
        options={options}
        resourceType={resourceType}
        addable={true}
        maxItems={1}
      />
    );
  }
  renderMultiResourceOrSimple() {
    let resourceType;
    for (const type of this.props.schema.items.anyOf) {
        if ('resType' in type) { resourceType = type.resType; }
    }
    resourceType = resourceType.split('/').slice(-1)[0];
    const options = this.props.data[resourceType].map((resource: any) => ({
      id: resource.id,
      label: resource.name || resource.id
    }));

    return (
      <ResourceArray
        label={this.props.schema.description}
        value={this.props.value || []}
        onChange={this.props.onChange}
        options={options}
        resourceType={resourceType}
        addable={true}
      />
    );
  }

  renderMultiString() {
    return (
      <StringArray
        label={this.props.schema.description}
        value={this.props.value || []}
        onChange={this.props.onChange}
      />
    );
  }

  render() {
    const field = this.props.schema;

    if (field.type === 'string') {
      return this.renderTextInput();
    } else if (field.type === 'array' && 'items' in field && field.items.enum) {
      return this.renderMultiEnum();
    } else if (field.type === 'array' && 'items' in field && 'resType' in field.items) {
      return this.renderMultiResource();
    } else if (field.type === 'array' && 'items' in field && 'anyOf' in field.items) {
      return this.renderMultiResourceOrSimple();
    } else if (field.type === 'array' && (!('items' in field) || !('enum' in field.items))) {
      return this.renderMultiString();
    } else if ('anyOf' in field) {
      return this.renderSingleResourceOrSimple();
    } else {
      return (<div>Unable to render field ({this.props.fieldName}): {JSON.stringify(field)}</div>);
    }
  }

}

export const FormField = connector(FormFieldComponent);
