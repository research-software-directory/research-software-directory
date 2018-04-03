import * as React from 'react';

import { IArraySchema } from '../../interfaces/json-schema';
import { IProps } from './IProps';
import FormPart from './FormPart';

export default class extends React.PureComponent<IProps<IArraySchema>> {
  render() {
    return (
      <div>
        { this.props.value && this.props.value.map((val: any) => (
          <FormPart
            value={val}
            settings={this.props.settings}
            schema={this.props.schema.items}
            data={this.props.data}
            label=""
            onChange={console.log}
          />
        )) }
      </div>
    );
  }
}
