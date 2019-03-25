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
      collapsed: !(Array.isArray(props.value) || props.value.length === 0)
    };
    if (!Array.isArray(props.value)) {
      this.props.onChange([]);
    }
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
    this.setState({ collapsed: false });
    this.props.onChange([...value, createEmpty(this.props.schema.items)]);
  };

  onDelete = (index: any) => {
    const valCopy = [...this.props.value];
    valCopy.splice(index, 1);
    this.props.onChange(valCopy);
  };

  render() {
    let value: any[] = this.props.value;
    if (!Array.isArray(value)) {
      return null;
    }
    let error = !!(
      this.props.validationErrors && this.props.validationErrors.length > 0
    );

    return (
      <Container>
        <Header style={{ backgroundColor: error ? "red" : "#2185d0" }}>
          <HeaderContent>
            <ArrayButton
              onClick={() =>
                this.setState({ collapsed: !this.state.collapsed })
              }
            >
              {(this.props.settings && this.props.settings.label) ||
                this.props.label}{" "}
              &nbsp;
              {Array.isArray(this.props.value) && (
                <Label color="blue" circular={true}>
                  {this.props.value.length}
                </Label>
              )}&nbsp;
              <Icon name={this.state.collapsed ? "angle down" : "angle up"} />
            </ArrayButton>
            <Button color="blue" onClick={this.onAdd}>
              +
            </Button>
          </HeaderContent>
        </Header>
        <Contents>
          {!this.state.collapsed &&
            value.map((val: any, index: number) => (
              <ArrayItem key={value.length + '_' + index}>
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
                    readonly={
                      !!this.props.readonly || !!this.props.settings.readonly
                    }
                    data={this.props.data}
                    label=""
                    onChange={(v: any) => this.handleChange(index, v)}
                    resourceTemplates={this.props.resourceTemplates}
                  />
                </ItemRight>
              </ArrayItem>
            ))}
        </Contents>
      </Container>
    );
  }
}

const ArrayButton = styled.div`
  border: none;
  border-radius: 0 !important;
  width: 100%;
  text-align: left;
`;

const Contents = styled.div`
  border: 1px solid #2185d0;
`;

const DeleteButton = styled(Button)`` as StyledComponentClass<ButtonProps, {}>;

const ArrayItem = styled.section`
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  &:nth-child(odd) {
    background-color: #eee;
  }
  &:nth-child(even) {
    background-color: white;
  }
  &:hover {
    background-color: rgba(0, 0, 65, 0.2);
  }
`;

const Header = styled.div`
  position: relative;
  min-width: 200px;
  cursor: pointer;
  display: inline-block;
  padding-left: 1em;
  color: white;
  font-weight: bold;
  &:hover {
    color: #ccc;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

// interface IContainerProps {
//   error: boolean;
// }

const Container = styled.section``;
