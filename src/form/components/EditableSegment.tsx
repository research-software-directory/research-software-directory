import * as React from 'react';

import { Button, Popup, Segment } from 'semantic-ui-react';

import { Shorthand } from './Shorthand';

interface IProps {
  value: any;
}

export class EditableSegment extends React.Component<IProps, {}> {
  render() {
    const seg = (
      <Segment className="editable">
        {JSON.stringify(this.props.value)}
        <Button size="mini" floated="right" icon="close"/>
      </Segment>
    );

    return (
      <Popup on="click" trigger={seg}  position="top right" >
        <Shorthand.Person value={this.props.value} />
      </Popup>
    );
  }
}
