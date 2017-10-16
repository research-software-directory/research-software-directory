import * as React from 'react';
import { connect } from 'react-redux';
import { updateField } from './actions';
import { Link } from 'react-router-dom';
import { FormField } from './FormField';
import { Button, Segment } from 'semantic-ui-react';
import {ISchema} from '../../interfaces/json-schema';

import './style.css';
import {IResource, IResourceType} from '../../interfaces/resource';
import {ISoftware} from '../../interfaces/resources/software';

interface IMappedProps {
  schema: ISchema;
  data: IResource;
  oldData: IResource;
}

interface IDispatchProps {
  updateField: typeof updateField;
}

interface IOwnProps {
  resourceType: IResourceType;
  id: string;
}

type IProps = IMappedProps & IDispatchProps & IOwnProps;

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

const connector = connect(mapStateToProps, mapDispatchToProps);

class ResourceFormComponent extends React.PureComponent<IProps, any> {
  updateFormValue = (field: string) => (value: any) => {
    this.props.updateField(this.props.resourceType, this.props.id, field, value);
  }

  hasChanged(field: string) {
    if (!this.props.oldData) { return true; }

    return this.props.data[field] !== this.props.oldData[field];
  }

  getGithubID = () => {
    if ((this.props.data as ISoftware).githubid) {
      return (this.props.data as ISoftware).githubid;
    } else {
      return '';
    }
  }

  renderField = (field: string): any => {
    return (
      <FormField
        key={field}
        fieldName={field}
        parentResourceType={this.props.resourceType}
        property={this.props.schema[this.props.resourceType].properties[field]}
        value={this.props.data[field]}
        hasChanged={this.hasChanged(field)}
        onChange={this.updateFormValue(field)}
        githubid={this.getGithubID()}
        id={this.props.id}
      />
    );
  }

  schemaSort = (properties: any) => (a: string, b: string) => {
    if ('sortIndex' in properties[a] && 'sortIndex' in properties[b]) {
        return properties[a].sortIndex < properties[b].sortIndex
          ? -1
          : properties[a].sortIndex > properties[b].sortIndex ? 1 : 0;
    }
    if ('sortIndex' in properties[a]) { return -1; }
    if ('sortIndex' in properties[b]) { return 1; }

    return a.localeCompare(b);
  }

  renderFields = (schema: any) =>
    Object.keys(schema.properties)
      .filter((property: string) => !schema.properties[property].hidden)
      .sort(this.schemaSort(schema.properties))
      .map((field: string) => this.renderField(field))

  impactReportButton = () => (
    <Link to={`${this.props.id}/report/`}><Button>Impact reports</Button></Link>
  )

  render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <div className="main_form">
        {this.props.id}
        {this.props.resourceType === 'software' && this.impactReportButton()}
        <Segment.Group>{this.renderFields(this.props.schema[this.props.resourceType])}</Segment.Group>
      </div>
    );
  }
}

export const ResourceForm = connector(ResourceFormComponent);
