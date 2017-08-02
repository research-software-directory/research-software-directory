import * as React from 'react';

import { Button, Dropdown, Icon, Segment } from 'semantic-ui-react';

interface IProps {
  label: string;
  options: IOption[];
  value: string[] | string;
  addable?: boolean;
  multi?: boolean;
  search?: boolean;
  onChange?(value: string | string[]): void;
  onNewOption?(option: IOption): void;
}

export interface IOption {
  value: string;
  label: string;
  icon?: string;
}

interface IState {
  search: string;
}

export class MultiSelect extends React.Component<IProps, IState> {
  defaults = {
    addable: false,
    multi: false,
    search: false
  };

  componentWillMount() {
    this.setState({search: ''});
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

  addButton = () => {
    if (!this.props.addable || !this.state.search) { return null; }
    const onClick = () => {
      if (this.props.onNewOption) {
        this.props.onNewOption({value: this.state.search, label: this.state.search});
      }
      if (this.props.onChange) {
        this.props.onChange([...this.props.value as string[], this.state.search ]);
      }
      this.setState({search: ''});
    };

    return (
      <Button
        onClick={onClick}
        size="small"
      >
        <Icon name="plus" /> {this.state.search}
      </Button>
    );
  }

  options = () => {
    return this.props.options.map((option: IOption) =>
      ({ text: option.label, key: option.value, value: option.value, icon: option.icon }));
  }

  render() {
    // const props = {...this.defaults, ...this.props};

    return (
      <Segment>
        <p>{this.props.label}</p>
        {this.addButton()}
        <Dropdown
          placeholder="Select"
          fluid={true}
          search={this.props.search || false}
          selection={true}
          options={this.options()}
          multiple={this.props.multi || false}
          onChange={this.onChange}
          value={this.props.value}
          onSearchChange={this.onSearchChange}
        />
      </Segment>
    );
  }
}
