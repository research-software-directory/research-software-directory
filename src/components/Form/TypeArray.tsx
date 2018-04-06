import * as React from "react";

import { Button } from "semantic-ui-react";
import { IArraySchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import FormPart from "./FormPart";
import { createEmpty } from "../../utils/createEmpty";

export default class extends React.PureComponent<IProps<IArraySchema>> {
  handleChange(index: number, value: any) {
    const valCopy = [...this.props.value];
    valCopy[index] = value;
    this.props.onChange(valCopy);
  }

  onAdd = () => {
    this.props.onChange([
      ...this.props.value,
      createEmpty(this.props.schema.items)
    ]);
  };

  render() {
    let value = this.props.value;
    if (!Array.isArray(value)) {
      value = [];
    }

    return (
      <div>
        {value.map((val: any, index: number) => (
          <FormPart
            value={val}
            settings={this.props.settings}
            schema={this.props.schema.items}
            data={this.props.data}
            label=""
            onChange={(v: any) => this.handleChange(index, v)}
          />
        ))}
        <Button onClick={this.onAdd}>+ Add</Button>
      </div>
    );
  }
}
