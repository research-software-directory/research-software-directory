import * as React from "react";
import { Input, InputProps } from "semantic-ui-react";
import * as moment from "moment";

import { IProps } from "./IProps";
import styled, { StyledComponentClass } from "styled-components";
import { IStringSchema } from "../../interfaces/json-schema";

export default class TypeString extends React.Component<
  IProps<IStringSchema>,
  {}
> {
  shouldComponentUpdate(newProps: IProps<IStringSchema>) {
    return newProps.value !== this.props.value;
  }
  render() {
    let error = false;
    if ("format" in this.props.schema) {
      const format = this.props.schema.format;
      if (format === "uri") {
        error = !validUrl(this.props.value);
      } else if (format === "date-time") {
        error = !validDateTime(this.props.value);
      }
    }
    return (
      <Horizontal>
        {this.props.showLabel !== false && (
          <Label>
            {(this.props.settings && this.props.settings.label) ||
              this.props.label}
          </Label>
        )}
        <TextInput
          error={error}
          size="large"
          defaultValue={this.props.value}
          onChange={(_, elm) => this.props.onChange(elm.value)}
        />
      </Horizontal>
    );
  }
}

function validUrl(value: string) {
  try {
    // tslint:disable-next-line:no-unused-expression
    new URL(value);
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
  }
  return true;
}

function validDateTime(value: string) {
  return moment(value).isValid();
}

/*
  https://github.com/styled-components/styled-components/issues/1233
 */
const TextInput = styled(Input)`
  flex: 1;
` as StyledComponentClass<InputProps, {}>;

const Horizontal = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  display: inline-block;
  min-width: 150px;
  font-weight: bold;
`;
