import * as React from "react";
import { IObjectSchema } from "../../interfaces/json-schema";
import FormPart from "./FormPart";
import { IProps } from "./IProps";
import styled from "styled-components";

export default class TypeObject extends React.Component<IProps<IObjectSchema>> {
  handleChange = (key: string) => (value: any) => {
    this.props.onChange({ ...this.props.value, [key]: value });
  };

  shouldComponentUpdate(newProps: IProps<IObjectSchema>) {
    return (
      newProps.value !== this.props.value || newProps.data !== this.props.data
    );
  }

  sortKeys = (a: string, b: string) => {
    if (a === "foreignKey") {
      return -1;
    }
    if (b === "foreignKey") {
      return 1;
    }
    if (
      this.props.settings &&
      this.props.settings.properties &&
      this.props.settings.properties[a] &&
      this.props.settings.properties[b] &&
      this.props.settings.properties[a].sortIndex &&
      this.props.settings.properties[b].sortIndex
    ) {
      return (
        this.props.settings.properties[a].sortIndex -
        this.props.settings.properties[b].sortIndex
      );
    } else {
      return 0;
    }
  };

  render() {
    const contents = (
      <div>
        {Object.keys(this.props.schema.properties)
          .sort(this.sortKeys)
          .map((key: string) => (
            <FormPart
              key={key}
              value={this.props.value ? this.props.value[key] : undefined}
              settings={
                (this.props.settings &&
                  this.props.settings.properties &&
                  this.props.settings.properties[key]) || { label: "" }
              }
              readonly={!!this.props.readonly || !!this.props.settings.readonly}
              schema={this.props.schema.properties[key]}
              data={this.props.data}
              label={key}
              onChange={this.handleChange(key)}
            />
          ))}
        {this.props.validationErrors &&
          this.props.validationErrors.map((error, i) => (
            <div key={i}>
              <span style={{ color: "red" }}>{error.message}</span>
            </div>
          ))}
      </div>
    );
    // if (!contents) {
    //   return null;
    // }

    if (this.props.showLabel !== false) {
      return (
        <Container>
          <Label>
            {(this.props.settings && this.props.settings.label) ||
              this.props.label}
          </Label>
          <div style={{ flex: 1 }}>{contents}</div>
        </Container>
      );
    }

    return contents;
  }
}

const Label = styled.label``;

const Container = styled.div`
  padding: 0.5em;
  border: 1px dashed black;
`;
