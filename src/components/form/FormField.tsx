import * as React from 'react';
import { connect } from 'react-redux';
// import { addToSchemaEnum } from './actions';
import * as comp from './components';
import {
  IProperty, isAnyOfProperty, isArrayProperty, isEnumProperty, isLinkProperty, isStringProperty
} from '../../interfaces/json-schema';
import { IStoreState } from '../../containers/store';

const mapDispatchToProps = {
  // addToSchemaEnum
};

const mapStateToProps = (state: IStoreState) => {
  return ({
    data: state.current.data
  });
};

interface IMappedProps {
  data: any;
  // addToSchemaEnum: typeof addToSchemaEnum;
}

interface IOwnProps {
  fieldName: string;
  githubid?: string;
  parentResourceType: string;
  property: IProperty;
  value: any;
  hasChanged: boolean;
  id: string;
  onChange(value: any): void;
}

const connector = connect<IMappedProps, {}, IOwnProps>(mapStateToProps, mapDispatchToProps);

class FormFieldComponent extends React.Component<IMappedProps & IOwnProps, {}> {
  shouldComponentUpdate(nextProps: IMappedProps&IOwnProps) {
    return (nextProps.value !== this.props.value)
        || (nextProps.property !== this.props.property)
        || (nextProps.githubid !== this.props.githubid);
  }

  onNewOption = (option: comp.IOption) => {
    return false && option;
    // this.props.addToSchemaEnum(this.props.parentResourceType, this.props.fieldName, option.value as string );
  }

  schemaEnum(): string[] {
    if (isEnumProperty(this.props.property)) {
      return this.props.property.enum;
    } else if (isArrayProperty(this.props.property) && isEnumProperty(this.props.property.items)) {
      return this.props.property.items.enum;
    }

    return [];
  }

  defaultFieldProps = (isArray = false) => ({
    value: this.props.value || (isArray ? [] : ''),
    label: this.props.property.description || '',
    onChange: this.props.onChange,
    className: this.props.hasChanged ? 'dirty' : ''
  })

  renderTextInput           = () => <comp.TextInput            {...this.defaultFieldProps()} />;
  renderTextArea            = () => <comp.TextAreaInput        {...this.defaultFieldProps()} />;
  renderMarkDown            = () => <comp.MarkDownInput        {...this.defaultFieldProps()} />;
  renderSoftwareDescription = () => <comp.SoftwareDescription  {...this.defaultFieldProps()} />;
  renderDateInput           = () => <comp.DateInput            {...this.defaultFieldProps()} />;
  renderMultiString         = () => <comp.StringArray          {...this.defaultFieldProps(true)} />;

  renderEnum(multi: boolean = true) {
    const options = this.schemaEnum().map((option) =>
      ({label: option, value: option, key: option}));

    return (
      <comp.MultiSelect
        {...this.defaultFieldProps(true)}
        options={options}
        multi={multi}
        search={true}
        addable={true}
        onNewOption={this.onNewOption}
      />
    );
  }

  renderMultiResource() {
    if (!(isArrayProperty(this.props.property) && isLinkProperty(this.props.property.items))) { return null; }
    const resourceType = this.props.property.items.resType.split('/').slice(-1)[0];
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
        {...this.defaultFieldProps(true)}
        options={options}
        resourceType={resourceType}
        addable={false}
      />
    );
  }

  changeSingle = (func: (val: any) => void) => (val: any[]) => func(val ? val[0] : '');
  renderSingleResourceOrSimple() {
    if (!isAnyOfProperty(this.props.property)) { return null; }
    const resourceType = this.getAnyOfResourceType(this.props.property.anyOf)
      .split('/').slice(-1)[0];
    const options = this.getOptions(resourceType);

    return (
      <comp.ResourceArray
        label={this.props.property.description || ''}
        value={this.props.value ? [this.props.value] : []}
        onChange={this.changeSingle(this.props.onChange)}
        options={options}
        resourceType={resourceType}
        addable={true}
        maxItems={1}
      />
    );
  }

  getAnyOfResourceType(anyOfProperty: any[]) {
    for (const subProperty of anyOfProperty) {
      if (isLinkProperty(subProperty)) {
        return subProperty.resType;
      }
    }

    return '';
  }

  renderMultiResourceOrSimple() {
    if (!(isArrayProperty(this.props.property) && isAnyOfProperty(this.props.property.items))) { return null; }
    const resourceType = this.getAnyOfResourceType(this.props.property.items.anyOf)
      .split('/').slice(-1)[0];
    const options = this.getOptions(resourceType);

    return (
      <comp.ResourceArray
        {...this.defaultFieldProps(true)}
        options={options}
        resourceType={resourceType}
        addable={true}
      />
    );
  }

  getOptions(resourceType: string) {
    return this.props.data[resourceType].map((resource: any) => ({
      id: resource.id,
      label: resource.name || resource.id
    }));
  }

  renderSoftwareReleases() {
    return (
      <comp.SoftwareReleases
        {...this.defaultFieldProps(true)}
        githubid={this.props.githubid || ''}
        id={this.props.id}
      />
    );
  }

  render() {
    const property = this.props.property;

    if (this.props.fieldName === 'releases') {
      return this.renderSoftwareReleases();
    } else if (this.props.parentResourceType === 'software' && this.props.fieldName === 'description') {
      return this.renderSoftwareDescription();
    } else if (isStringProperty(property) && 'markdown' in property) {
      return this.renderMarkDown();
    } else if (isStringProperty(property) && 'long' in property) {
      return this.renderTextArea();
    } else if (isStringProperty(property) && 'format' in property && property.format === 'date') {
      return this.renderDateInput();
    } else if (isEnumProperty(property)) {
      return this.renderEnum(false);
    } else if (isStringProperty(property)) {
      return this.renderTextInput();
    } else if (isArrayProperty(property) && isEnumProperty(property.items)) {
      return this.renderEnum(true);
    } else if (isArrayProperty(property) && isLinkProperty(property.items)) {
      return this.renderMultiResource();
    } else if (isArrayProperty(property) && isAnyOfProperty(property.items)) {
      return this.renderMultiResourceOrSimple();
    } else if (isArrayProperty(property)) {
      return this.renderMultiString();
    } else if (isAnyOfProperty(property)) {
      return this.renderSingleResourceOrSimple();
    } else {
      return (<div>Unable to render field ({this.props.fieldName}): {JSON.stringify(property)}</div>);
    }
  }

}

export const FormField = connector(FormFieldComponent);
