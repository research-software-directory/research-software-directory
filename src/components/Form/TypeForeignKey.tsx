import * as React from "react";
import { IProps } from "./IProps";
import { IStringSchema } from "../../interfaces/json-schema";

export default class extends React.Component<IProps<IStringSchema>, {}> {
  render() {
    return <div>Im a foreign key</div>;
  }
}
