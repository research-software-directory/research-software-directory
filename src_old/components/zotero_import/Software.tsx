import * as React from 'react';
import { List, Button, Input, Icon, Message } from 'semantic-ui-react';
import { ISoftware } from '../../interfaces/resources/software';
import { transformSoftware } from './transform';

interface IProps {
  item: any; // software to be imported
  software: ISoftware[]; // current software
  createNewItem(resourceType: string,
                id: string,
                fields?: object,
                navigateTo?: boolean): any;
  updateField(resourceType: string,
              id: string,
              field: string,
              value: any): any;
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
    const regexpVersions = /(: )?(v|V)?(\d|\.)*$/;
    return id.toLowerCase().replace(regexpVersions, '').trim().replace(/[^a-zA-Z0-9]+/g, '-');
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

  zoteroKeyExists = () => {
    return !!this.props.software.find((software: any) => software.zoteroKey === this.props.item.key);
  }

  idExists = () => {
    return !!this.props.software.find((software: any) => software.id === this.state.id);
  }

  isDisabled = () => this.zoteroKeyExists() || this.idExists() || (this.state.id.length < 2);

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
      transformSoftware(this.props.item)
    );
  }

  renderOpen = () => {
    if (!this.idExists()) {
      const software = this.softwareWithSameGithubID();
      if (software) {
        return (
          <Message>
            Software with same github ID exists.
            <Button
              disabled={this.isDisabled()}
              onClick={() => this.props.updateField('software', software.id, 'zoteroKey', this.props.item.key)}
              primary={true}
            >
              Update zoteroKey on {software.id}
            </Button>
          </Message>
        );
      }
    }

    const actionButton = (
      <Button
        disabled={this.isDisabled()}
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
          {this.props.item.data.title}
        </span>

        {this.state.open && this.renderOpen()}
      </List.Item>
    );
  }
}
