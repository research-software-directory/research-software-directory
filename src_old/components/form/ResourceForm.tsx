import * as React from 'react';
import { FormFieldContainer } from '../../containers/form/FormFieldContainer';
import { Segment, Header } from 'semantic-ui-react';
import { ISchema } from '../../interfaces/json-schema';

import './style.css';
import { IResource, IResourceType, ISoftware } from '../../interfaces/resource';

interface IProps {
  schema: ISchema;
  data: IResource;
  oldData: IResource;
  resourceType: IResourceType;
  id: string;
  updateField(resourceType: string, id: string, field: string, value: any): any;
}

export class ResourceForm extends React.PureComponent<IProps, {}> {
  updateFormValue = (field: string) => (value: any) => {
    this.props.updateField(this.props.resourceType, this.props.id, field, value);
  }

  hasChanged(field: string) {
    if (!this.props.oldData) { return true; }

    return this.props.data[field] !== this.props.oldData[field];
  }

  getGithubID = () => (this.props.data as ISoftware).githubid || '';

  renderField = (field: string): any => {
    return (
      <FormFieldContainer
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
      .filter((property: string) => schema.properties[property].editable !== false)
      .filter((property: string) => !schema.properties[property].hidden)
      .sort(this.schemaSort(schema.properties))
      .map((field: string) => this.renderField(field))

  render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <div className="main_form">
        <Segment.Group>
          <Segment secondary={true}>
            <Header>{this.props.id}</Header>
          </Segment>
          {this.renderFields(this.props.schema[this.props.resourceType])}</Segment.Group>
      </div>
    );
  }
}
