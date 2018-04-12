import * as React from "react";
import { IProps } from "./IProps";
import { IForeignKeySchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import styled from "styled-components";

interface IState {
  choices: DropdownItemProps[];
}

export default class TypeForeignKey extends React.Component<
  IProps<IForeignKeySchema>,
  IState
> {
  constructor(props: IProps<IForeignKeySchema>) {
    super(props);
    this.state = {
      choices: this.computeChoices()
    };
  }

  computeChoices() {
    console.log("schema", this.props.schema.properties);
    const foreignData = this.props.data[
      this.props.schema.properties.collection.enum[0]
    ];
    return foreignData.map(
      (item: IResource) =>
        console.log(item) || {
          key: item.primaryKey.id,
          value: item.primaryKey.id,
          text: item.primaryKey.id
        }
    );
  }

  shouldComponentUpdate(newProps: IProps<IForeignKeySchema>) {
    return (
      newProps.value !== this.props.value || newProps.data !== this.props.data
    );
  }

  render() {
    return (
      <Container>
        <Left>
          {this.props.showLabel !== false && (
            <Label>{this.props.settings.label || this.props.label}</Label>
          )}
        </Left>
        <Dropdown
          defaultValue={this.props.value ? this.props.value.id : null}
          selection={true}
          fluid={true}
          search={true}
          options={this.state.choices}
          style={{ flex: 1 }}
        />
      </Container>
    );
  }
}

const Left = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 50px;
`;

const Label = styled.label`
  display: inline-block;
  font-weight: bold;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
