import * as React from "react";

import { ISettings } from "../../rootReducer";
import { ISchema } from "../../interfaces/json-schema";
import { IData } from "../../interfaces/resource";
import { IResource } from "../../interfaces/resource";
import FormPart from "./FormPart";
import "./style.css";
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
  _rootFormPart: any = null;

  getValidationErrors = () =>
    this._rootFormPart.getValidationErrors(this.props.value);

  handleChange = (newValue: any) => {
    this.props.onChange(newValue);
  };

  render() {
    const type = this.props.value.primaryKey.collection;
    return (
      <div style={{ height: "100%" }}>
        <FormPart
          ref={ref => (this._rootFormPart = ref)}
          schema={this.props.schema[type]}
          readonly={false}
          settings={this.props.settings.resources[type]}
          value={this.props.value}
          data={this.props.data}
          onChange={this.handleChange}
          showLabel={false}
          label=""
        />
      </div>
    );
  }
}
