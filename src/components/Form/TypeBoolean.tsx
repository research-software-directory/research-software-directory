import * as React from "react";
import { Checkbox } from "semantic-ui-react";
import { IProps } from "./IProps";
import { IStringSchema } from "../../interfaces/json-schema";
import styled from "styled-components";
import { Help } from "./Help";

export default class TypeBoolean extends React.Component<
  IProps<IStringSchema>,
  {}
> {
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
          <Checkbox
            toggle={true}
            checked={!!this.props.value}
            readOnly={!!this.props.readonly || !!this.props.settings.readonly}
            onChange={(_, elm) => this.props.onChange(elm.checked)}
          />
        </div>
      </Horizontal>
    );
  }
}

const Label = styled.label`
  display: inline-block;
  font-weight: bold;
  min-width: 150px;
`;

const Horizontal = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;
