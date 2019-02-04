import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import styled from "styled-components";

import { IProps } from "./IProps";
import { IStringEnumSchema } from "../../interfaces/json-schema";
import { Help } from "./Help";

export default class TypeStringEnum extends React.Component<
  IProps<IStringEnumSchema>,
  {}
> {
  isNull = (props: IProps<IStringEnumSchema>) => {
    return props.schema.enum.length === 1;
  };

  render() {
    const options = this.props.schema.enum.map(val => ({
      text: val,
      value: val
    }));
    if (this.isNull(this.props)) {
      return null;
    }
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
          <Dropdown
            disabled={!!this.props.readonly || !!this.props.settings.readonly}
            fluid={true}
            search={true}
            selection={true}
            options={options}
            defaultValue={this.props.value}
            onChange={(_, elm) => this.props.onChange(elm.value)}
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

/*
  https://github.com/styled-components/styled-components/issues/1233
 */
// const TextInput = styled(Input)`
//   width: 100%;
