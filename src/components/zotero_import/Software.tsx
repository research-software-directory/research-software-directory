import * as React from 'react';
import { List, Button, Input, Icon } from 'semantic-ui-react';
import { ISoftware } from '../../interfaces/resources/software';

interface IProps {
  item: any; // software to be imported
  software: ISoftware[]; // current software
  createNewItem(resourceType: string,
                id: string,
                fields?: object,
                navigateTo?: boolean): any;

}

interface IState {
  open: boolean;
  id: string;
}

export class Software extends React.Component<IProps, IState> {
  constructor() {
    super();
    this.state = {open: false, id: ''};
  }

  sanitizeID = (id: string) => {
    return id.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  }

  softwareName = () => this.props.item.data.title;

  componentWillMount() {
    const softwareName = this.softwareName();
    this.setState({id: this.sanitizeID(softwareName) });
  }

  toggleOpen = () => {
    this.setState({open: true });
  }

  onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState ({id: this.sanitizeID(e.currentTarget.value)});
  }

  idExists = () => {
    return !!this.props.software.find((software: any) => software.id === this.state.id);
  }

  softwareWithSameGithubID = () => {
    return this.props.software.find(
      (software: any) =>
        software.githubid &&
        this.props.item.data.githubid &&
        software.githubid.toLowerCase() === this.props.item.data.githubid.toLowerCase()
    );
  }

  createNew = () => {
    this.props.createNewItem(
      'software',
      this.state.id,
      { ...this.props.item,
        name: this.softwareName()
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

    const software = this.softwareWithSameGithubID();
    if (software) {
      return (
        <div>
          Software with same github ID exists
        </div>
      );
    }

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
          {this.props.item.data.title}
        </span>

        {this.state.open && this.renderOpen()}
      </List.Item>
    );
  }
}
