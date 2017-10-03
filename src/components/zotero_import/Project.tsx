import * as React from 'react';
import { List, Button, Input, Label } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {createNewItem} from '../../shared/resource/actions';

interface IOwnProps {
  item: any;
}

interface IMappedProps {
  projects: any[];
}

const mapDispatchToProps = ({
  createNewItem
});

type IDispatchProps = typeof mapDispatchToProps;

interface IState {
  open: boolean;
  id: string;
}

const mapStateToProps = (state: any) => ({
  projects: state.current.data.project
});

const connector = connect<IMappedProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps);

export const Project = connector(class extends React.Component<IOwnProps&IMappedProps&IDispatchProps, IState> {
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

  idExists = () => {
    return this.props.projects.find((project: any) => project.id === this.state.id);
  }

  createNew = () => {
  //     this.props.createNewItem(
  //   'project',
  //   this.state.id,
  //   this.props.schema
  //     );
  }

  renderOpen = () => {
    const buttonDisabled = this.state.id.length < 2 || this.idExists();

    return (
      <div style={{float: 'right'}}>
        <Label>ID:</Label>
        <Input value={this.state.id} floated="right" size="tiny" onChange={this.onInputChange}/>
        <Button
          color={buttonDisabled ? 'red' : 'green'}
          disabled={buttonDisabled}
          onClick={this.createNew}
        >OK
        </Button>
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
