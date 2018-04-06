import * as React from "react";
import { Checkbox } from "semantic-ui-react";
import { IProps } from "./IProps";
import { IStringSchema } from "../../interfaces/json-schema";

export default class extends React.Component<IProps<IStringSchema>, {}> {
  render() {
    return (
      <div>
        <Checkbox
          toggle={true}
          checked={!!this.props.value}
          onChange={(_, elm) => this.props.onChange(elm.checked)}
        />
      </div>
    );
  }
}
