import * as React from 'react';

import { IOption, MultiSelect } from './MultiSelect';

import { connect } from 'react-redux';

interface IOwnProps {
  label: string;
  resourceType: string;
  value: string[];
  onChange?(value: string): void;
}

interface IStateProps {
  resources: any[];
}

const mapStateToProps = (state: any, props: IOwnProps) => ({
  resources: state.current.data[props.resourceType]
});

const connector = connect(mapStateToProps, {});

class ResourceArrayComponent extends React.Component<IOwnProps & IStateProps, {}> {
  label = (option: any) => {
    switch (this.props.resourceType) {
      case 'person': return option.name;
      default: return option.description;
    }
  }

  onChange = (e: any, data: any) => {
    if (this.props.onChange) {
      this.props.onChange(data.value);
    }

    return e;
  }

  onSearchChange = (e: any, search: string) => {
    this.setState({search});

    return e;
  }

  render() {
    const options: IOption[] = this.props.resources.map((option) => ({
      icon: 'user',
      label: this.label(option),
      value: option.id
    }));

    return (
      <MultiSelect
        label={this.props.label}
        search={true}
        options={options}
        multi={true}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    );
  }
}

export const ResourceArray = connector(ResourceArrayComponent);
