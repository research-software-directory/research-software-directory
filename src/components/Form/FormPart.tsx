import * as React from "react";
import { IForeignKeySchema, ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import { getElement } from "./elementFactory";
import styled from "styled-components";

interface IState {
  hasError: boolean;
  error: any;
  info: any;
}

export default class FormPart extends React.Component<IProps<ISchema>, IState> {
  constructor(props: IProps<ISchema>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }

  shouldComponentUpdate(newProps: IProps<IForeignKeySchema>) {
    return (
      newProps.value !== this.props.value || newProps.data !== this.props.data
    );
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true, error, info });
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ShowError>{this.state.error.stack.toString()}</ShowError>;
    }
    const Component = getElement(this.props.schema);
    return (
      <div
        style={{
          minHeight: "4em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Component {...this.props} />
      </div>
    );
  }
}

const ShowError = styled.pre`
  background-color: red;
  color: white;
  white-space: pre-wrap;
`;
