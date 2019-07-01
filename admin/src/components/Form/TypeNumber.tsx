import * as React from "react";
import { Input, InputProps } from "semantic-ui-react";

import { IProps } from "./IProps";
import styled, { StyledComponentClass } from "styled-components";
import { INumberSchema } from "../../interfaces/json-schema";
import { debounce } from "../../utils/debounce";
import { Help } from "./Help";

export class TypeNumber extends React.Component<IProps<INumberSchema>> {
  onChange: any;
  constructor(props: IProps<INumberSchema>) {
    super(props);
    this.onChange = debounce(this.props.onChange, 300);
    if (props.value === "" || props.value === null) {
      this.props.onChange("");
    }
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
          {this.props.settings.help && (
            <Help message={this.props.settings.help} />
          )}
          <TextInput
            disabled={!!this.props.readonly || !!this.props.settings.readonly}
            size="large"
            defaultValue={this.props.value}
            onChange={(_: any, elm: any) => this.onChange(Number.parseFloat(elm.value))}
            error={
              this.props.validationErrors &&
              this.props.validationErrors.length > 0
            }
            type="number"
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
