import * as React from "react";

import { ISettings } from "../../rootReducer";
import { ISchema } from "../../interfaces/json-schema";
import { IData } from "../../interfaces/misc";
import { IResource } from "../../interfaces/resource";
import FormPart from "./FormPart";

interface IConnectedProps {
  schema: { [key: string]: ISchema };
  data: IData;
  value: IResource;
  settings: ISettings;
  push(location: any): any;
}

interface IOwnProps {
  onChange: (data: IResource) => any;
}

interface IState {}

type IProps = IConnectedProps & IOwnProps;

export default class extends React.PureComponent<IProps, IState> {
  handleChange = (newValue: any) => {
    this.props.onChange(newValue);
  };

  render() {
    const type = this.props.value.primaryKey.collection;
    return (
      <div style={{ height: "100%" }}>
        <FormPart
          schema={this.props.schema[type]}
          settings={this.props.settings.resources[type]}
          value={this.props.value}
          data={this.props.data}
          onChange={this.handleChange}
          label=""
        />
      </div>
    );
  }
}
