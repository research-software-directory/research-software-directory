import * as React from 'react';

import { Button, Input } from 'semantic-ui-react';

interface IProps {
  value: any;
}

export class Person extends React.Component<IProps, {}> {
  render() {
   return (
    <div>
      {JSON.stringify(this.props.value)}
      <Input defaultValue={this.props.value} />
      <Button color="green">Save</Button>
    </div>
  );
  }
}
