import * as React from "react";
import { IProps } from "./IProps";
import { IForeignKeySchema } from "../../interfaces/json-schema";
import { IResource } from "../../interfaces/resource";
import { Dropdown } from "semantic-ui-react";

interface IState {
  foreignData: any[] | null;
}

export default class extends React.PureComponent<
  IProps<IForeignKeySchema>,
  IState
> {
  state = { foreignData: null };
  componentDidMount() {
    this.setState({
      foreignData: this.props.data[
        this.props.schema.properties.collection.enum[0]
      ]
    });
  }
  render() {
    const items = (this.state.foreignData || []).map((item: IResource) => ({
      key: item.primaryKey.id,
      value: item.primaryKey.id,
      text: item.primaryKey.id
    }));

    return (
      <Dropdown
        defaultValue={this.props.value ? this.props.value.id : null}
        selection={true}
        fluid={true}
        search={true}
        options={items}
      />
    );
  }
}
