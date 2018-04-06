import * as React from "react";
import { Segment } from "semantic-ui-react";
import { ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import { getElement } from "./elementFactory";
import styled from "styled-components";

interface IState {
  hasError: boolean;
  error: any;
  info: any;
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
    const element = getElement(this.props.schema, this.props);
    return (
      <Segment>
        <Label>{this.props.label}</Label>:
        {element}
      </Segment>
    );
  }
}

const Label = styled.label`
  font-size: 2em;
`;
