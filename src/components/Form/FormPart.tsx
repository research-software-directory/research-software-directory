import * as React from "react";
import { IForeignKeySchema, ISchema } from "../../interfaces/json-schema";
import { IProps } from "./IProps";
import { getComponent } from "./elementFactory";
import styled, { StyledComponentClass } from "styled-components";
import { debounce } from "../../utils/debounce";
import * as Ajv from "ajv";
import { Message, MessageProps } from "semantic-ui-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface IState {
  hasError: boolean;
  error: any;
  info: any;
  validationError: Ajv.ErrorObject[];
}

export default class FormPart extends React.Component<IProps<ISchema>, IState> {
  validate: (newProps: IProps<ISchema>) => any;
  _ajvValidator: (value: any) => boolean | PromiseLike<any>;
  constructor(props: IProps<ISchema>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      validationError: [],
      info: null
    };
    const metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");
    const ajv = new Ajv({ schemaId: "auto" });
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
    this.validate(this.props);
  }

  _validate(props: IProps<ISchema>) {
    const isValid = this._ajvValidator(props.value);
    this.setState({
      validationError: isValid ? [] : (this._ajvValidator as any).errors
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
      this.validate(newProps);
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
          minHeight: "4em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Component {...this.props} />
        <TransitionGroup>
          {this.state.validationError
            .filter(error => error.dataPath === "")
            .map(error => (
              <CSSTransition
                key={error.keyword}
                timeout={500}
                classNames="message"
              >
                <ErrorMessage negative={true}>
                  <Message.Header>{error.keyword}</Message.Header>
                  {error.message}
                </ErrorMessage>
              </CSSTransition>
            ))}
        </TransitionGroup>
      </div>
    );
  }
}

const ShowError = styled.pre`
  background-color: red;
  color: white;
  white-space: pre-wrap;
`;

const ErrorMessage = styled(Message)`
  transition: all 0.5s !important;
  opacity: 0;
  overflow: hidden;
  &.message-exit {
    transform: translateY(-25px) translateX(-15px);
    opacity: 0;
  }
  &.message-enter {
    transform: translateY(25px);
  }
  &.message-enter-done {
    transform: none;
    opacity: 1;
  }
  &:last-child {
    //margin-bottom: 2em !important;
  }
` as StyledComponentClass<MessageProps, {}>;
