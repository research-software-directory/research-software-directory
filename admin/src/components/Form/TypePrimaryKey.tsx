import * as React from "react";
import { Help } from "./Help";
import styled from "styled-components";

import { ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";

export class TypePrimaryKey extends React.Component<IProps<ISchema>> {
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
          {this.props.value.collection} / {this.props.value.id}
        </div>
      </Horizontal>
    );
  }
}

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
