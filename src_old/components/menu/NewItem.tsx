import * as React from 'react';
import { Button, Icon, Input } from 'semantic-ui-react';

interface IProps {
  resourceType: string;
  data: any;
  createNewItem(resourceType: string,
                id: string,
                fields?: object,
                navigateTo?: boolean): any;
}

interface IState {
  open: boolean;
  id: string;
}

export class NewItem extends React.PureComponent<IProps, IState> {
  componentWillMount() {
    this.setState({open: false, id: ''});
  }

  open = () => {
    // this.setState({open: true});
  }

  updateId = (e: any) => {
    this.setState({id: e.target.value});
  }

  createNew = () => {
    this.setState({id: '', open: false});
    this.props.createNewItem(
      this.props.resourceType,
      this.state.id
    );
  }

  idIsValid = () =>
    this.state.id.length > 1 &&
    !this.props.data.find(
      (item: any) => item.id === this.state.id
    )

  render() {
    if (!this.state.open) {
      return (
        <Button size="mini" disabled={true} onClick={this.open}>+ New</Button>
      );
    } else {

      const idIsValid = this.idIsValid();

      return (
        <div>
          <Input
            size="mini"
            type="text"
            label="id"
            value={this.state.id}
            onChange={this.updateId}
            inverted={true}
          />
          <Button
            onClick={this.createNew}
            icon={true}
            size="mini"
            inverted={true}
            color={idIsValid ? 'green' : 'red'}
            disabled={!idIsValid}
          >
            <Icon name="write" />
          </Button>
        </div>
      );
    }
  }
}
