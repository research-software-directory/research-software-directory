import * as React from "react";
import { Input, InputProps } from "semantic-ui-react";
import { IProps } from "./IProps";
import styled, { StyledComponentClass } from "styled-components";
import { IStringSchema } from "../../interfaces/json-schema";

export default class extends React.Component<IProps<IStringSchema>, {}> {
  render() {
    return (
      <div>
        <TextInput
          size="large"
          defaultValue={this.props.value}
          onChange={(_, elm) => console.log(elm.value)}
        />
      </div>
    );
  }
}

/*
  https://github.com/styled-components/styled-components/issues/1233
 */
const TextInput = styled(Input)`
  width: 100%;
` as StyledComponentClass<InputProps, {}>;
