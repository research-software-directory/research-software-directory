import * as React from 'react';

import { connect } from 'react-redux';

import { Button, Icon, Input } from 'semantic-ui-react';

import { createNewItem } from './actions';

import { History } from 'history';

interface IOwnProps {
  resourceType: string;
}

const mapStateToProps: (state: any, ownProps: IOwnProps) => any =
  (state: any, ownProps: IOwnProps) => ({
    data:   state.data[ownProps.resourceType],
    schema: state.schema[ownProps.resourceType]
  });

const dispatchToProps = {
  createNewItem
};

const connector = connect(mapStateToProps, dispatchToProps );

interface IDispatchProps {
  createNewItem(resourceType: string, id: string, schema: any, history: History): any;
}

interface IProps {
  data: any;
  schema: any;
  resourceType: string;
  history: History;
}

interface IState {
  open: boolean;
  id: string;
}

class NewItemComponent extends React.PureComponent<IProps & IDispatchProps, IState> {
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
      `/${this.props.resourceType}/${this.state.id}`,
      this.props.schema,
      this.props.history
    );
  }

  render() {
      if (!this.state.open) {
        return (
          <Button size="mini" onClick={this.open}>+ New</Button>
        );
      } else {

        let idIsValid = true;
        if (this.state.id === '' || (this.props.data.find(
          (item: any) => item.id === `/${this.props.resourceType}/${this.state.id}`
        ))) {
          idIsValid = false;
        }

        return (
          <div>
            {`/${this.props.resourceType}/`}
            <Input
              size="mini"
              type="text"
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
