import * as React from 'react';
import { List, Button, Input, Icon } from 'semantic-ui-react';
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

  projectName = () => this.props.item.name.split(' ').slice(1).join(' ');

  componentWillMount() {
    const projectName = this.projectName();
    this.setState({id: this.sanitizeID(projectName) });
  }

  toggleOpen = () => {
    // this.setState({open: !this.state.open });
    this.setState({open: true });
  }

  onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState ({id: this.sanitizeID(e.currentTarget.value)});
  }

  idExists = () => {
    return !!this.props.projects.find((project: any) => project.id === this.state.id);
  }

  createNew = () => {
    this.props.createNewItem(
      'project',
      this.state.id,
      { ...this.props.item,
        name: this.projectName()
      }
    );
  }

  renderOpen = () => {
    const buttonDisabled = (this.state.id.length < 2) || this.idExists();
    const actionButton = (
      <Button
        disabled={buttonDisabled}
        onClick={this.createNew}
      >OK
      </Button>
    );

    return (
      <div style={{float: 'right'}}>
        <Input
          label="ID:"
          value={this.state.id}
          size="tiny"
          onChange={this.onInputChange}
          action={actionButton}
        />
      </div>
    );
  }

  render() {
    return (
      <List.Item onClick={this.toggleOpen} style={{cursor: 'pointer'}}>
        <span>
          <Icon name="lab" />
          {this.props.item.name}
        </span>

        {this.state.open && this.renderOpen()}
      </List.Item>
    );
  }
}
);

// {!this.state.open && <Button floated="right" size="tiny" onClick={this.toggleOpen}>Import</Button>}
