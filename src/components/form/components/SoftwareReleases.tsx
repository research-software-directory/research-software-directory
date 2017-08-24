import * as React from 'react';

import { Button, Icon, Input, Loader, Segment } from 'semantic-ui-react';

import ReactDatePicker from 'react-datepicker';

import * as moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import './SoftwareReleases.css';

import { rawReq } from '../../../services/async';

interface IProps {
  maxItems?: number;
  label: string;
  value: IRelease[];
  githubid: string;
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
  const onDateChange = (m: moment.Moment) => onChange('date')(m.format('YYYY-MM-DD'));
  const onInputChange = (field: string) => (e: any) => onChange(field)(e.target.value);

  return (
    <Segment className="softwareRelease" style={{display: 'flex'}}>
      <ReactDatePicker
        onChange={onDateChange}
        customInput={<Button>{props.value.date} <Icon name="calendar"/></Button>}
      />
      <Input onChange={onInputChange('version')} type="text" value={props.value.version} placeholder="version"/>
      <Input onChange={onInputChange('doi')} value={props.value.doi} placeholder="doi"/>
      <Button icon={true} onClick={props.onDelete}><Icon name="remove" /></Button>
    </Segment>
  );

};

interface IState {
  githubError: string | null;
  githubStatus: number;
}

const GITHUB_STATUS = {
  FAILED: 3,
  FULFILLED: 2,
  IDLE : 0,
  LOADING: 1
};

export class SoftwareReleases extends React.Component<IProps, IState> {
  componentWillMount() {
    this.setState({githubError: null, githubStatus: GITHUB_STATUS.IDLE});
  }
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
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const req = rawReq.get(`githubreleases?id=${this.props.githubid}`);
    this.setState({githubError: null, githubStatus: GITHUB_STATUS.LOADING});
    req.then((value: any) => {
      this.setState({githubStatus: GITHUB_STATUS.FULFILLED});
      const newValue = [...this.props.value];
      value.data.forEach((item: any) => {
        if (!newValue.find((oldRelease: IRelease) => oldRelease.version === item.version)) {
          newValue.push({
            date: moment(item.date).format('YYYY-MM-DD'),
            doi: '',
            version: item.version
          });
        }
      });
      this.props.onChange(newValue);
    });
    req.catch((res: any) => {
      if (res.response && res.response.data) {
        this.setState({githubError: res.response.data.error, githubStatus: GITHUB_STATUS.FAILED});
      } else {
        this.setState({githubError: 'unknown error', githubStatus: GITHUB_STATUS.FAILED});
      }
    });
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
          <Loader inline={true} active={this.state.githubStatus === GITHUB_STATUS.LOADING} size="tiny" />
        </Button> <br />
        {this.state.githubError} <br />
        <Button icon={true} onClick={this.addNew}><Icon name="plus" /></Button>
        <Segment.Group>{segments}</Segment.Group> <br />
      </Segment>
    );
  }
}
