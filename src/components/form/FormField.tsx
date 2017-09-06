import * as React from 'react';
import { connect } from 'react-redux';
import { addToSchemaEnum } from './actions';
import * as comp from './components';

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
  githubid?: string;
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
        || (nextProps.schema !== this.props.schema)
        || (nextProps.githubid !== this.props.githubid);
  }

  onNewOption = (option: comp.IOption) => {
    this.props.addToSchemaEnum(this.props.parentResourceType, this.props.fieldName, option.value as string );
  }

  schemaEnum(): string[] {
    return (this.props.schema.type === 'array') ? (this.props.schema.items.enum || []) : (this.props.schema.enum || []);
  }

  renderTextInput() {
    return (
      <comp.TextInput
        value={this.props.value || ''}
        label={this.props.schema.description}
        onChange={this.props.onChange}
        className={this.props.hasChanged ? 'dirty' : ''}
      />
    );
  }

  renderTextArea() {
    return (
      <comp.TextAreaInput
        value={this.props.value || ''}
        label={this.props.schema.description}
        onChange={this.props.onChange}
        className={this.props.hasChanged ? 'dirty' : ''}
      />
    );
  }

  renderMarkDown() {
    return (
      <comp.MarkDownInput
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
      <comp.MultiSelect
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
    const options = this.props.data[resourceType].map((resource: any) => {
      const opt = {
        id: resource.id,
        label: resource.name || resource.id
      };

      if (resourceType === 'publication') {
        opt.label = `${resource.DOI && `[${resource.DOI}]` || ''} ${resource.title}`;
      }

      return opt;
    });

    return (
      <comp.ResourceArray
        label={this.props.schema.description}
        value={this.props.value || []}
        onChange={this.props.onChange}
        options={options}
        resourceType={resourceType}
        addable={false}
      />
    );
  }

  changeSingle = (func: (val: any) => void) => (val: any[]) => func(val ? val[0] : '');
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
      <comp.ResourceArray
        label={this.props.schema.description}
        value={this.props.value ? [this.props.value] : []}
        onChange={this.changeSingle(this.props.onChange)}
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
      <comp.ResourceArray
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
      <comp.StringArray
        label={this.props.schema.description}
        value={this.props.value || []}
        onChange={this.props.onChange}
      />
    );
  }

  renderSoftwareReleases() {
    return (
      <comp.SoftwareReleases
        label={this.props.schema.description}
        value={this.props.value || []}
        onChange={this.props.onChange}
        githubid={this.props.githubid}
      />
    );
  }

  renderDateInput() {
    return (
      <comp.DateInput
        label={this.props.schema.description}
        value={this.props.value || ''}
        onChange={this.props.onChange}
      />
    );
  }

  render() {
    const field = this.props.schema;
    if (this.props.fieldName === 'releases') {
      return this.renderSoftwareReleases();
    } else if (field.type === 'string' && 'markdown' in field) {
      return this.renderMarkDown();
    } else if (field.type === 'string' && 'long' in field) {
      return this.renderTextArea();
    } else if (field.type === 'string' && 'format' in field && field.format === 'date') {
      return this.renderDateInput();
    } else if (field.type === 'string') {
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
