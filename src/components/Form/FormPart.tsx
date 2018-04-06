import * as React from "react";
// import { Segment } from "semantic-ui-react";
import { ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import { getElement } from "./elementFactory";
import styled from "styled-components";
import TypeArray from "./TypeArray";

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
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <pre
          style={{
            backgroundColor: "red",
            color: "white",
            whiteSpace: "pre-wrap"
          }}
        >
          error: {this.state.error.stack.toString()}
        </pre>
      );
    }
    const element = getElement(this.props.schema, this.props);
    return (
      <Section border={element.type === TypeArray}>
        {this.props.label && <Label>{this.props.label}</Label>}
        {element}
      </Section>
    );
  }
}

const Label = styled.label`
  font-weight: bold;
`;

interface ISectionProps {
  border: boolean;
}

const Section = styled.section`
  padding-left: 0.5em;
  margin-bottom: 1em;
  border: ${(p: ISectionProps) => (p.border ? "1px solid black" : "none")};
`;
