import * as React from "react";
import styled from "styled-components";

import {
  isArraySchema,
  ISchema,
  isObjectSchema
} from "../../interfaces/json-schema";
import TypeObject from "./TypeObject";
import TypeDummy from "./TypeDummy";
import TypeArray from "./TypeArray";
import { IProps } from "./IProps";

interface IState {
  hasError: boolean;
  error: any;
  info: any;
}

function getComponent(schema: ISchema): any {
  return isObjectSchema(schema)
    ? TypeObject
    : isArraySchema(schema) ? TypeArray : TypeDummy;
}

export default class FormPart extends React.PureComponent<
  IProps<ISchema>,
  IState
> {
  constructor(props: IProps<ISchema>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }
  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError) {
      return <div>error: {JSON.stringify(this.state)}</div>;
    }
    const Component = getComponent(this.props.schema);
    return (
      <Container>
        <label>{this.props.label}</label>
        <Component {...this.props} />
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 1em;
  border: 1px solid black;
  margin-bottom: 1em;
`;
