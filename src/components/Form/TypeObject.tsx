import * as React from "react";

import { Segment } from "semantic-ui-react";
import { IObjectSchema } from "../../interfaces/json-schema";
import FormPart from "./FormPart";
import { IProps } from "./IProps";

export default class extends React.Component<IProps<IObjectSchema>> {
  handleChange = (key: string) => (value: any) => {
    this.props.onChange({ ...this.props.value, [key]: value });
  };

  shouldComponentUpdate(newProps: IProps<IObjectSchema>) {
    return (
      newProps.value !== this.props.value || newProps.data !== this.props.data
    );
  }

  render() {
    const contents = Object.keys(this.props.schema.properties).map(
      (key: string) => (
        <FormPart
          key={key}
          value={this.props.value[key]}
          settings={this.props.settings && this.props.settings[key]}
          schema={this.props.schema.properties[key]}
          data={this.props.data}
          label={key}
          onChange={this.handleChange(key)}
        />
      )
    );
    if (!contents) {
      return null;
    }
    return <Segment>{contents}</Segment>;
  }
}
