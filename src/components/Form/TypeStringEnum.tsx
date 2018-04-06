import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import { IProps } from "./IProps";
import { IStringEnumSchema } from "../../interfaces/json-schema";

export default class extends React.Component<IProps<IStringEnumSchema>, {}> {
  isNull = (props: IProps<IStringEnumSchema>) => {
    return props.schema.enum.length === 1;
  };

  render() {
    const options = this.props.schema.enum.map(val => ({
      text: val,
      value: val
    }));
    if (this.isNull(this.props)) {
      return null;
    }
    return (
      <div>
        <Dropdown
          fluid={true}
          search={true}
          selection={true}
          options={options}
          defaultValue={this.props.value}
          onChange={(_, elm) => console.log(elm.value)}
        />
      </div>
    );
  }
}

/*
  https://github.com/styled-components/styled-components/issues/1233
 */
// const TextInput = styled(Input)`
//   width: 100%;
