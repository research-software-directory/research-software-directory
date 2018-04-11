import * as React from "react";
import { IProps } from "./IProps";
import { IForeignKeySchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";

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
    const foreignData = this.props.data[
      this.props.schema.properties.collection.enum[0]
    ];
    return foreignData.map((item: IResource) => ({
      key: item.primaryKey.id,
      value: item.primaryKey.id,
      text: item.primaryKey.id
    }));
  }

  shouldComponentUpdate(newProps: IProps<IForeignKeySchema>) {
    return (
      newProps.value !== this.props.value || newProps.data !== this.props.data
    );
  }

  render() {
    return (
      <Dropdown
        defaultValue={this.props.value ? this.props.value.id : null}
        selection={true}
        fluid={true}
        search={true}
        options={this.state.choices}
      />
    );
  }
}
