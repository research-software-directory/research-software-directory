import * as React from "react";
import { IForeignKeySchema, ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import { getComponent } from "./elementFactory";
import styled from "styled-components";
import { debounce } from "../../utils/debounce";
import * as Ajv from "ajv";

interface IState {
  hasError: boolean;
  error: any;
  info: any;
  validationError: Ajv.ErrorObject[];
}

export default class FormPart extends React.Component<IProps<ISchema>, IState> {
  validate: (newProps: IProps<ISchema>) => any;
  _ajvValidator: (value: any) => boolean | PromiseLike<any>;
  _component: any;

  constructor(props: IProps<ISchema>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      validationError: [],
      info: null
    };
    const metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");
    const ajv = new Ajv({ schemaId: "auto", allErrors: true });
    ajv.addMetaSchema(metaSchema);
    /* https://www.crossref.org/blog/dois-and-matching-regular-expressions/ */
    // ajv.addFormat("doi", /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i);
    ajv.addFormat(
      "base64",
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
    );
    this._ajvValidator = ajv.compile({
      ...props.schema,
      $schema: "http://json-schema.org/draft-04/schema",
      $id: "bla"
    });
    this.validate = debounce(this._validate, 300);
    this.validate(this.props.value);
  }

  getValidationErrors(value: any) {
    let errors = [];
    if (value !== undefined) {
      const isValid = this._ajvValidator(value);
      if (!isValid) {
        errors = (this._ajvValidator as any).errors;
      }
    }
    if (this._component && this._component.validate) {
      errors.push(...this._component.validate());
    }
    return errors;
  }

  _validate(value: any) {
    this.setState({
      validationError: this.getValidationErrors(value)
    });
  }

  shouldComponentUpdate(newProps: IProps<IForeignKeySchema>, newState: IState) {
    return (
      newState !== this.state ||
      newProps.value !== this.props.value ||
      newProps.data !== this.props.data
    );
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true, error, info });
    console.error(error, info, this.props);
  }

  componentWillReceiveProps(newProps: IProps<ISchema>) {
    if (newProps.value !== this.props.value) {
      this.validate(newProps.value);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ShowError>Error: {this.state.error.stack.toString()}</ShowError>;
    }
    const Component = getComponent(this.props.schema, this.props.settings);
    return (
      <div
        style={{
          marginBottom: ".5em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Component
          {...this.props}
          ref={(ref: any) => (this._component = ref)}
          validationErrors={this.state.validationError.filter(
            error => !error.dataPath || error.dataPath === ""
          )}
        />
        <div style={{ display: "none" }}>
          {JSON.stringify(
            this.state.validationError.filter(error => error.dataPath === "")
          )}
        </div>
      </div>
    );
  }
}

const ShowError = styled.pre`
  background-color: red;
  color: white;
  white-space: pre-wrap;
`;
