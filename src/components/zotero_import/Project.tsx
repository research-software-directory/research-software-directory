import * as React from 'react';
import { List, Button, Input, Label } from 'semantic-ui-react';
import {checkProjectID} from './actions';
import {connect} from 'react-redux';

interface IOwnProps {
  item: any;
}

interface IState {
  open: boolean;
  id: string;
}

const dispatchToProps = {
  checkID: checkProjectID
};

type IDispatchProps = typeof dispatchToProps;

const connector = connect<{}, IDispatchProps, IOwnProps>(null, dispatchToProps);

export const Project = connector(class extends React.Component<IOwnProps&IDispatchProps, IState> {
  constructor() {
    super();
    this.state = {open: false, id: ''};
  }

  sanitizeID = (id: string) => {
    return id.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  }

  componentWillMount() {
    const projectName = this.props.item.name.split(' ').slice(1).join(' ');
    this.setState({id: this.sanitizeID(projectName) });
  }

  toggleOpen = () => {
    this.setState({open: !this.state.open });
  }

  onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState ({id: this.sanitizeID(e.currentTarget.value)});
  }

  checkID = () => {
    this.props.checkID(this.state.id);
  }

  renderOpen = () => {
    return (
      <div style={{float: 'right'}}>
        <Label>ID:</Label>
        <Input value={this.state.id} floated="right" size="tiny" onChange={this.onInputChange}/>
        <Button onClick={this.checkID} >OK</Button>
      </div>
    );
  }

  render() {
    return (
      <List.Item icon="lab">
        {this.props.item.zotero_key} {this.props.item.name}
        {!this.state.open && <Button floated="right" size="tiny" onClick={this.toggleOpen}>Import</Button>}
        {this.state.open && this.renderOpen()}
      </List.Item>
    );
  }
}
);
