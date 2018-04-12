import * as React from "react";

import { Button, Label, Icon, ButtonProps } from "semantic-ui-react";
import { IArraySchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import FormPart from "./FormPart";
import { createEmpty } from "../../utils/createEmpty";
import styled, { StyledComponentClass } from "styled-components";

interface IState {
  collapsed: boolean;
}

export default class TypeArray extends React.Component<
  IProps<IArraySchema>,
  IState
> {
  constructor(props: IProps<IArraySchema>) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  shouldComponentUpdate(newProps: IProps<IArraySchema>, newState: IState) {
    return (
      newProps.value !== this.props.value ||
      newProps.data !== this.props.data ||
      newState !== this.state
    );
  }

  handleChange(index: number, value: any) {
    const valCopy = [...this.props.value];
    valCopy[index] = value;
    this.props.onChange(valCopy);
  }

  onAdd = () => {
    let value = this.props.value;
    if (!Array.isArray(value)) {
      value = [];
    }
    this.props.onChange([...value, createEmpty(this.props.schema.items)]);
  };

  onDelete = (index: any) => {
    const valCopy = this.props.value.filter(
      (_element: any, i: number) => i !== index
    );
    this.props.onChange(valCopy);
  };

  render() {
    let value = this.props.value;
    if (!Array.isArray(value)) {
      value = [];
    }

    return (
      <div style={{ border: "1px solid blue" }} className="form--array">
        <Header>
          <ArrayButton
            primary={true}
            onClick={() => this.setState({ collapsed: !this.state.collapsed })}
          >
            {this.props.settings.label || this.props.label} &nbsp;
            {Array.isArray(this.props.value) && (
              <Label color="blue" circular={true}>
                {this.props.value.length}
              </Label>
            )}&nbsp;
            <Icon name={this.state.collapsed ? "angle down" : "angle up"} />
          </ArrayButton>
          {!this.state.collapsed && (
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <Button color="blue" onClick={this.onAdd}>
                +
              </Button>
            </div>
          )}
        </Header>
        {!this.state.collapsed &&
          value.map((val: any, index: number) => (
            <Section key={index}>
              <ItemLeft>
                <DeleteButton
                  secondary={true}
                  onClick={() => this.onDelete(index)}
                >
                  x
                </DeleteButton>
              </ItemLeft>
              <ItemRight>
                <FormPart
                  value={val}
                  settings={this.props.settings}
                  schema={this.props.schema.items}
                  showLabel={false}
                  data={this.props.data}
                  label=""
                  onChange={(v: any) => this.handleChange(index, v)}
                />
              </ItemRight>
            </Section>
          ))}
      </div>
    );
  }
}

// const FieldLabel = styled.label`
//   display: inline-block;
//   font-weight: bold;
// `;
const ArrayButton = styled(Button)`
  border: none;
  border-radius: 0 !important;
  width: 100%;
  text-align: left;
` as StyledComponentClass<ButtonProps, {}>;

const DeleteButton = styled(Button)`` as StyledComponentClass<ButtonProps, {}>;

const Section = styled.section`
  display: flex;
  flex-direction: row;
  padding: 0.5em;
`;

const Header = styled.div`
  position: relative;
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
`;

const ItemRight = styled.div`
  flex: 1;
`;
