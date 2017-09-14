import * as React from 'react';
import * as moment from 'moment';
import { Button, Icon, Input, Segment } from 'semantic-ui-react';
import { DatePicker } from '../../datepicker/DatePicker';

import './SoftwareReleases.css';
import {updateFieldFromBackend} from '../actions';
import {connect} from 'react-redux';

interface IProps {
  maxItems?: number;
  label: string;
  value: IRelease[];
  githubid: string;
  id: string;
  onChange(value: IRelease[]): void;
}

interface IRelease {
  doi: string;
  version: string;
  date: string;
}

interface IReleaseProps {
  value: IRelease;
  onChange(value: IRelease): void;
  onDelete(): void;
}

const Release = (props: IReleaseProps) => {
  const onChange = (field: string) => (value: string) => props.onChange( { ...props.value, [field]: value } );
  const onInputChange = (field: string) => (e: any) => onChange(field)(e.target.value);

  return (
    <Segment className="softwareRelease" style={{display: 'flex'}}>
      <DatePicker
        value={props.value.date}
        onChange={onChange('date')}
      />
      <Input onChange={onInputChange('version')} type="text" value={props.value.version} placeholder="version"/>
      <Input onChange={onInputChange('doi')} value={props.value.doi} placeholder="doi"/>
      <Button icon={true} onClick={props.onDelete}><Icon name="remove" /></Button>
    </Segment>
  );

};

interface IDispatchProps {
  updateFieldFromBackend: typeof updateFieldFromBackend;
}

const connector = connect(null, {updateFieldFromBackend});

export const SoftwareReleases = connector(class extends React.Component<IProps & IDispatchProps, {}> {
  addNew = () => {
    const newRelease = {
      date: '',
      doi: '',
      version: ''
    };
    this.props.onChange([newRelease, ...this.props.value]);
  }

  onChange = (key: number) => (val: IRelease) => {
    const newValue = [ ...this.props.value ];
    newValue[key] = val;
    this.props.onChange(newValue);
  }

  onDelete = (key: number) => () => {
    const newValue = [...this.props.value];
    newValue.splice(key, 1);
    this.props.onChange(newValue);
  }

  onGitHubButton = () => {
    this.props.updateFieldFromBackend(
      'software',
      this.props.id,
      'releases',
      `githubreleases?id=${this.props.githubid}`,
      (oldValue: any, newValue: any) => {
        const mergeValue = [...oldValue];
        newValue.forEach((item: any) => {
          if (!mergeValue.find((oldRelease: IRelease) => oldRelease.version === item.version)) {
            mergeValue.push({
              date: moment(item.date).format('YYYY-MM-DD'),
              doi: '',
              version: item.version
            });
          }
        });

        return mergeValue;
      }
    );
  }

  render() {
    const segments = this.props.value.map((item: IRelease, key: number) => {
      return (
        <Release
          key={key}
          value={item}
          onChange={this.onChange(key)}
          onDelete={this.onDelete(key)}
        />
      );
    });

    return (
      <Segment>
        {this.props.label} <br />
        <Button onClick={this.onGitHubButton}>
          Load from GitHub ({this.props.githubid}) &nbsp;
        </Button> <br />
        <Button icon={true} onClick={this.addNew}><Icon name="plus" /></Button>
        <Segment.Group>{segments}</Segment.Group> <br />
      </Segment>
    );
  }
});
