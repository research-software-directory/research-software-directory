import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TypeBoolean from "../components/Form/TypeBoolean";
import TypeString from "../components/Form/TypeString";
import TypeStringEnum from "../components/Form/TypeStringEnum";
import TypeObject from "../components/Form/TypeObject";
import TypeArray from "../components/Form/TypeArray";
import TypeForeignKey from "../components/Form/TypeForeignKey";

storiesOf("Form elements", module)
  .add("StringEnum", () => (
    <TypeStringEnum
      schema={{ enum: ["option1", "option2", "option3"] }}
      value="option1"
      settings={{}}
      onChange={action("change")}
      label="StringEnum"
    />
  ))
  .add("Object", () => (
    <TypeObject
      schema={{
        properties: {
          prop1: { type: "string" },
          prop2: { type: "boolean" }
        }
      }}
      value={{
        prop1: "asdasd",
        prop2: false
      }}
      settings={{}}
      onChange={action("change")}
      label="Object"
    />
  ))
  .add("ForeignKey", () => (
    <TypeForeignKey
      schema={{
        properties: {
          collection: {
            enum: ["things"]
          }
        }
      }}
      data={{
        things: [
          {
            primaryKey: {
              id: "thing1"
            },
            name: "thing1"
          },
          {
            primaryKey: {
              id: "thing2"
            },
            name: "things2"
          }
        ]
      }}
      value={{ collection: "things", id: "thing1" }}
      resourceTemplates={{ things: "{{ name }}" }}
      settings={{ readonly: false }}
      onChange={action("change")}
      label="ForeignKey"
    />
  ));

storiesOf("Form elements/Array", module)
  .add("default", () => (
    <TypeArray
      schema={{
        items: {
          type: "string"
        }
      }}
      value={["asdasd", "asdasddsa"]}
      settings={{}}
      onChange={action("change")}
      label="Array"
    />
  ))
  .add("minItems=1 valid", () => (
    <TypeArray
      schema={{
        items: {
          type: "string"
        },
        minItems: 1
      }}
      value={["asdasd", "asdasddsa"]}
      settings={{}}
      onChange={action("change")}
      label="Array"
    />
  ))
  .add("minItems=1 invalid", () => (
    <TypeArray
      schema={{
        items: {
          type: "string"
        },
        minItems: 1
      }}
      value={[]}
      settings={{}}
      onChange={action("change")}
      label="Array"
    />
  ));

storiesOf("Form elements/String", module)
  .add("default", () => (
    <TypeString
      schema={{
        type: "string"
      }}
      value={"Value here"}
      settings={{}}
      onChange={action("change")}
      label="String"
    />
  ))
  .add("format=uri valid", () => (
    <TypeString
      schema={{
        format: "uri",
        type: "string"
      }}
      value={"https://example.com"}
      settings={{}}
      onChange={action("change")}
      label="String"
    />
  ))
  .add("format=uri invalid", () => (
    <TypeString
      schema={{
        format: "uri",
        type: "string"
      }}
      value={"Not an uri"}
      settings={{}}
      onChange={action("change")}
      label="String"
    />
  ))
  .add("format=date-time valid", () => (
    <TypeString
      schema={{
        format: "date-time",
        type: "string"
      }}
      value={"2017-11-14T13:37:17Z"}
      settings={{}}
      onChange={action("change")}
      label="String"
    />
  ))
  .add("format=date-time invalid", () => (
    <TypeString
      schema={{
        format: "date-time",
        type: "string"
      }}
      value={"Not a date-time"}
      settings={{}}
      onChange={action("change")}
      label="String"
    />
  ))
  .add("multiline", () => (
    <TypeString
      schema={{
        type: "string"
      }}
      value={"A\nmultiline\nfield"}
      settings={{
        multiline: true
      }}
      onChange={action("change")}
      label="String"
    />
  ))
  .add("with help", () => (
    <TypeString
      schema={{
        type: "string"
      }}
      value={"Value here"}
      settings={{
        help: "Some useful help message"
      }}
      onChange={action("change")}
      label="String"
    />
  ));

storiesOf("Form elements/Boolean", module)
  .add("Checked", () => (
    <TypeBoolean
      schema={null}
      value={true}
      settings={{}}
      onChange={action("change")}
      label="Boolean"
    />
  ))
  .add("Unchecked", () => (
    <TypeBoolean
      schema={null}
      value={false}
      settings={{}}
      onChange={action("change")}
      label="Boolean"
    />
  ))
  .add("with help", () => (
    <TypeBoolean
      schema={null}
      value={true}
      settings={{
        help: "Some useful help message"
      }}
      onChange={action("change")}
      label="Boolean"
    />
  ));
