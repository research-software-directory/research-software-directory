import * as React from "react";
import { Checkbox } from "semantic-ui-react";
import { IProps } from "./IProps";
import { IStringSchema } from "../../interfaces/json-schema";
import styled from "styled-components";

export default class TypeBoolean extends React.Component<
  IProps<IStringSchema>,
  {}
> {
  render() {
    return (
      <Horizontal>
        <Checkbox
          toggle={true}
          checked={!!this.props.value}
          onChange={(_, elm) => this.props.onChange(elm.checked)}
        />
        {this.props.showLabel !== false && (
          <Label>{this.props.settings.label || this.props.label}</Label>
        )}
      </Horizontal>
    );
  }
}

const Label = styled.label`
  display: inline-block;
  font-weight: bold;
  margin-left: 1em;
`;

const Horizontal = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;
