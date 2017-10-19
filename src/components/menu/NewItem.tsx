import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input } from 'semantic-ui-react';
import {createNewItem} from '../../containers/shared/resource/actions';

interface IOwnProps {
  resourceType: string;
}

interface IMappedProps {
  data: any;
}

const mapStateToProps: (state: any, ownProps: IOwnProps) => any =
  (state: any, ownProps: IOwnProps) => ({
    data:   state.data[ownProps.resourceType]
  });

const dispatchToProps = {
  createNewItem
};

type IDispatchProps = typeof dispatchToProps;
type IProps = IOwnProps & IMappedProps & IDispatchProps;
const connector = connect<IMappedProps, IDispatchProps>(mapStateToProps, dispatchToProps);

interface IState {
  open: boolean;
  id: string;
}

class NewItemComponent extends React.PureComponent<IProps, IState> {
  componentWillMount() {
    this.setState({open: false, id: ''});
  }

  open = () => {
    this.setState({open: true});
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
          <Button size="mini" onClick={this.open}>+ New</Button>
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

export const NewItem = connector(NewItemComponent);
