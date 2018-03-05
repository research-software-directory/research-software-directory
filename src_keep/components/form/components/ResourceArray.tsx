import * as React from 'react';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { EditableSegment } from './EditableSegment';
import { MultiSelect } from './MultiSelect';
import './ResourceArray.css';

import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import '../../../assets/style.css';

const icon = (resourceType: string) => {
  switch (resourceType) {
    case 'person'       : return 'user';
    case 'publication'  : return 'book';
    case 'project'      : return 'lab';
    case 'software'     : return 'file code outline';
    case 'organization' : return 'university';
    default: return 'caret right';
  }
};

interface IOption {
  label: string;
  id: string;
}

interface IProps {
  addable: boolean;
  maxItems?: number;
  label: string;
  value: any[];
  options: IOption[];
  resourceType: string;
  onChange(value: any[]): void;
}

export class ResourceArray extends React.PureComponent<IProps, {}> {
  addValue = (value: string) => {
    const oldValue = [...this.props.value];
    oldValue.push(value);
    this.props.onChange(oldValue);
  }

  newOption = (option: any) => {
    const oldValue = [...this.props.value];
    oldValue.push({name: option.value});
    this.props.onChange(oldValue);
  }

  updateValue = (key: number) => (value: any) => {
    const oldValue = [...this.props.value];
    oldValue[key] = value;
    this.props.onChange(oldValue);
  }

  removeValue = (key: number) => () => {
    const oldValue = [...this.props.value];
    oldValue.splice(key, 1);
    this.props.onChange(oldValue);
  }

  segments = () => {
    if (!this.props.value || !this.props.value.length) {
      return null;
    }
    const content = this.props.value
      .map((val, key) => {
      if (typeof val === 'string') {
        const option = this.props.options.find((opt: IOption) => opt.id === val);
        const label = option ? option.label : val;

        return (
          <Segment key={val}><Icon name={icon(this.props.resourceType)}/> {label}
            <Button size="mini" floated="right" icon="close" onClick={this.removeValue(key)}/>
          </Segment>
        );
      } else {
        return (
          <EditableSegment
            key={key}
            value={val}
            onChange={this.updateValue(key)}
            onDelete={this.removeValue(key)}
          />
        );
      }
    });

    return (
        <ReactCSSTransitionGroup
          transitionName="rt-fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={Segment.Group}
        >
          {content}
        </ReactCSSTransitionGroup>
    );
  }

  options = () => this.props.options
    .filter((option) => this.props.value.indexOf(option.id) === -1)
    .map((option) => ({ ...option, value: option.id, icon: icon(this.props.resourceType) }))

  render() {
    const input = (!this.props.maxItems || this.props.value.length < this.props.maxItems)
      ? (
        <MultiSelect
          label={'Add'}
          options={this.options()}
          multi={false}
          search={true}
          addable={this.props.addable}
          onChange={this.addValue}
          onNewOption={this.newOption}
          propagateNewOption={false}
          value={''}
        />)
      : null;

    return (
      <Segment className="ResourceArray">
        <p dangerouslySetInnerHTML={{__html: this.props.label}}/>
        {this.segments()}
        {input}
      </Segment>
    );
  }
}
