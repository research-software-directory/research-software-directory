import * as React from "react";

import { Button } from "semantic-ui-react";
import { IArraySchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import FormPart from "./FormPart";
import { createEmpty } from "../../utils/createEmpty";

export default class extends React.Component<IProps<IArraySchema>> {
  shouldComponentUpdate(newProps: IProps<IArraySchema>) {
    return (
      newProps.value !== this.props.value || newProps.data !== this.props.data
    );
  }

  handleChange(index: number, value: any) {
    const valCopy = [...this.props.value];
    valCopy[index] = value;
    this.props.onChange(valCopy);
  }

  onAdd = () => {
    let value = this.props.value;
    if (!Array.isArray(value)) {
      value = [];
    }
    this.props.onChange([...value, createEmpty(this.props.schema.items)]);
  };

  render() {
    let value = this.props.value;
    if (!Array.isArray(value)) {
      value = [];
    }

    return (
      <div>
        <Button onClick={this.onAdd}>+ Add</Button>
        {value.map((val: any, index: number) => (
          <FormPart
            key={index}
            value={val}
            settings={this.props.settings}
            schema={this.props.schema.items}
            data={this.props.data}
            label=""
            onChange={(v: any) => this.handleChange(index, v)}
          />
        ))}
      </div>
    );
  }
}
