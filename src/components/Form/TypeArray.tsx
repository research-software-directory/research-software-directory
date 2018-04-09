import * as React from "react";

import { Button, Label } from "semantic-ui-react";
import { IArraySchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import FormPart from "./FormPart";
import { createEmpty } from "../../utils/createEmpty";
import styled from "styled-components";

export default class TypeArray extends React.Component<IProps<IArraySchema>> {
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
      <div style={{ marginTop: "3em", marginBottom: "3em" }}>
        {Array.isArray(this.props.value) && (
          <Label color="blue" circular={true}>
            {this.props.value.length}
          </Label>
        )}
        {this.props.showLabel !== false && (
          <FieldLabel>
            {this.props.settings.label || this.props.label}
          </FieldLabel>
        )}
        <Button color="blue" size="mini" onClick={this.onAdd}>
          +
        </Button>
        {value.map((val: any, index: number) => (
          <FormPart
            key={index}
            value={val}
            settings={this.props.settings}
            showLabel={false}
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

const FieldLabel = styled.label`
  display: inline-block;
  font-weight: bold;
`;
