import * as React from "react";
import axios from "axios";

import { RouteComponentProps } from "react-router";
import { Button, Message } from "semantic-ui-react";

import { IJWT, ISettings } from "../../rootReducer";
import { ISchema } from "../../interfaces/json-schema";
import { IData } from "../../interfaces/resource";
import { IResource } from "../../interfaces/resource";
import Form from "../../containers/Form";

interface IConnectedProps {
  jwt: IJWT;
  schema: { [key: string]: ISchema };
  data: IData;
  settings: ISettings;
  push(location: any): any;
  messageToastr(message: string): any;
  errorToastr(message: string): any;
}

interface IState {
  loading: boolean;
  saving: boolean;
  data: IResource | null;
  validationErrors: any[];
}

type IProps = IConnectedProps &
  RouteComponentProps<{ resourceType: string; id: string }>;

export default class Resource extends React.PureComponent<IProps, IState> {
  form: any = null;

  save() {
    this.setState({ saving: true });
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    axios
      .put(
        `${backendUrl}/${resourceType}/${id}?save_history`,
        this.state.data,
        {
          headers: {
            Authorization: `Bearer ${this.props.jwt.token}`
          }
        }
      )
      .then(() => {
        this.setState({ saving: false });
        this.props.messageToastr("Saved");
      })
      .catch(response => {
        this.setState({ saving: false });
        this.props.errorToastr(JSON.stringify(response.response.data));
      });
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      saving: false,
      loading: true,
      data: null,
      validationErrors: []
    };
  }

  asyncSetState = async (newState: any) => {
    return new Promise(resolve => {
      this.setState(newState, resolve);
    });
  };

  async updateLocalData() {
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    const result = await axios.get(`${backendUrl}/${resourceType}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.props.jwt.token}`
      }
    });
    await this.asyncSetState({ data: result.data, loading: false });
  }

  async componentDidMount() {
    await this.updateLocalData();
    if (this.form) {
      this.setState({ validationErrors: this.form.getValidationErrors() });
    }
  }

  onChange = async (data: any) => {
    await this.asyncSetState({ data });
    await this.asyncSetState({
      validationErrors: this.form.getValidationErrors(),
      data
    });
  };

  render() {
    if (this.state.loading) {
      return null;
    }

    return (
      <div>
        <div>
          <Form
            ref={(elm: any) => (this.form = elm && elm.getWrappedInstance())}
            value={this.state.data!}
            onChange={this.onChange}
          />
        </div>
        {this.state.validationErrors.length > 0 && (
          <Message error={true}>
            {this.state.validationErrors.map((error, i) => (
              <div key={i}>
                {error.dataPath} {error.message}
              </div>
            ))}
          </Message>
        )}
        <Button
          disabled={this.state.saving || this.state.validationErrors.length > 0}
          onClick={() => this.save()}
        >
          {this.state.saving ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  }
}
