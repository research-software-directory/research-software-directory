import * as React from 'react';

import { FormField } from './FormField';

// tslint:disable-next-line:no-require-imports no-var-requires
const deepDiff = require('deep-diff').default;

import { connect } from 'react-redux';

import { updateField } from './actions';

import './style.css';

const mapDispatchToProps = {
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
    schema: state.current.schema
  });
};

interface IProps {
    schema: any;
    data: any;
    oldData: any;
    updateField: typeof updateField;
}

interface IOwnProps {
  resourceType: string;
  isNew: boolean;
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

  arrayToObjectById = (arr: any[]) => {
    return Object.assign({}, ...arr.map((obj) => ({[obj.id] : obj}) ));
  }

  compareStuff = () => {
    // console.log(deepDiff(this.props.oldSchema, this.props.schema));
  }

  hasChanged(field: string) {
    if (!this.props.oldData) { return true; }

    return !!deepDiff(this.props.data[field] || null, this.props.oldData[field] || null);
  }

  renderField = (field: string): any => {
    return (
      <FormField
        key={field}
        fieldName={field}
        parentResourceType={this.props.resourceType}
        schema={this.props.schema[this.props.resourceType].properties[field]}
        value={this.props.data[field]}
        hasChanged={this.hasChanged(field)}
        onChange={this.updateFormValue(field)}
      />
    );
  }

  alphabetSort = (a: string, b: string) => a.localeCompare(b);

  renderFields = (schema: any) =>
    Object.keys(schema.properties).sort(this.alphabetSort)
      .map((field: string) => this.renderField(field))

  render() {
    return (
      <div className="main_form">

        {this.props.id}
        <button onClick={this.compareStuff} >Compare stuff</button>
        {this.renderFields(this.props.schema[this.props.resourceType])}
      </div>
    );
  }
}

export const ResourceForm = connector(ResourceFormComponent);
