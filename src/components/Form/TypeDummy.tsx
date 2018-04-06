import * as React from "react";

import { ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";

export default class extends React.Component<IProps<ISchema>> {
  render() {
    return <div>{JSON.stringify(this.props.value)}</div>;
  }
}
