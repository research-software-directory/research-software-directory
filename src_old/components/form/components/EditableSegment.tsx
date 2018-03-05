import * as React from 'react';

import { Button, Popup, Segment } from 'semantic-ui-react';

import { Shorthand } from './shorthand';

interface IProps {
  value: any;
  onChange(value: any): void;
  onDelete(): void;
}

interface IState {
  popupOpen: boolean;
  data: any;
}

export class EditableSegment extends React.PureComponent<IProps, IState> {
  componentWillMount() {
    this.setState({
      data: {...this.props.value},
      popupOpen: false
    });
  }

  updateState = (value: any) => {
    this.setState({data : value });
  }

  save = () => {
    this.props.onChange(this.state.data);
    this.togglePopup();
  }

  togglePopup = () => {
    this.setState({popupOpen: !this.state.popupOpen});
  }

  render() {
    const seg = (
      <Segment className="editable" onClick={this.togglePopup}>
        {'name' in this.props.value ? this.props.value.name : JSON.stringify(this.props.value)}
        <Button size="mini" floated="right" icon="close" onClick={this.props.onDelete} />
      </Segment>
    );

    return (
      <Popup on="click" onClose={this.togglePopup} trigger={seg} position="top right" open={this.state.popupOpen} >
        <Shorthand.Person value={this.state.data} onChange={this.updateState} />
        <Button color="green" onClick={this.save} size="tiny">Update</Button>
      </Popup>
    );
  }
}
