import * as React from "react";
import { Input, InputProps } from "semantic-ui-react";

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
    return (
      <Horizontal>
        {this.props.showLabel !== false && (
          <Label>
            {(this.props.settings && this.props.settings.label) ||
              this.props.label}
          </Label>
        )}
        <TextInput
          disabled={!!this.props.readonly || !!this.props.settings.readonly}
          size="large"
          defaultValue={this.props.value}
          onChange={(_, elm) => this.props.onChange(elm.value)}
        />
      </Horizontal>
    );
  }
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
