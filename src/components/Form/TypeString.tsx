import * as React from "react";
import { Input, InputProps } from "semantic-ui-react";

import { IProps } from "./IProps";
import styled, { StyledComponentClass } from "styled-components";
import { IStringSchema } from "../../interfaces/json-schema";
import { debounce } from "../../utils/debounce";

export default class TypeString extends React.Component<
  IProps<IStringSchema>,
  {}
> {
  onChange: any;
  constructor(props: IProps<IStringSchema>) {
    super(props);
    this.onChange = debounce(this.props.onChange, 300);
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
        <div style={{ flex: 1 }}>
          <TextInput
            disabled={!!this.props.readonly || !!this.props.settings.readonly}
            size="large"
            defaultValue={this.props.value}
            onChange={(_, elm) => this.onChange(elm.value)}
            error={
              this.props.validationErrors &&
              this.props.validationErrors.length > 0
            }
          />
          {this.props.validationErrors &&
            this.props.validationErrors.map((error, i) => (
              <div key={i}>
                <span style={{ color: "red" }}>{error.message}</span>
              </div>
            ))}
        </div>
      </Horizontal>
    );
  }
}

/*
  https://github.com/styled-components/styled-components/issues/1233
 */
const TextInput = styled(Input)`
  width: 100%;
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
