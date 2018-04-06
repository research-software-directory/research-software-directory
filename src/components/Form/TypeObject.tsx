import * as React from "react";

import { IObjectSchema } from "../../interfaces/json-schema";
import FormPart from "./FormPart";
import { IProps } from "./IProps";

export default class extends React.PureComponent<IProps<IObjectSchema>> {
  handleChange(key: string, value: any) {
    this.props.onChange({ ...this.props.value, [key]: value });
  }

  render() {
    const contents = Object.keys(this.props.schema.properties).map(
      (key: string) => (
        <FormPart
          value={this.props.value[key]}
          settings={this.props.settings && this.props.settings[key]}
          schema={this.props.schema.properties[key]}
          data={this.props.data}
          label={key}
          onChange={(value: any) => this.handleChange(key, value)}
        />
      )
    );
    if (!contents) {
      return null;
    }
    console.log(this.props.schema.properties, contents);
    return <div>{contents}</div>;
  }
}
