import * as React from 'react';

import { Input } from 'semantic-ui-react';

interface IProps {
  value: any;
  onChange(value: any): void;
}

export class Person extends React.PureComponent<IProps, {}> {
  updateField = (field: string) => (e: any) => {
    this.props.onChange({ ...this.props.value, [field]: e.target.value });
  }

  render() {
   return (
    <div>
      <Input value={this.props.value.name || ''} placeholder="name" onChange={this.updateField('name')} />
      <Input value={this.props.value.url || ''} placeholder="URL" onChange={this.updateField('url')}/>
      <Input
        value={this.props.value.organization || ''}
        placeholder="Organization"
        onChange={this.updateField('organization')}
      />
    </div>
  );
  }
}
