import * as React from "react";

import axios from "axios";
import { RouteComponentProps } from "react-router";
import { Button, Message } from "semantic-ui-react";
import { v4 } from "uuid";
import * as moment from "moment";

import { IJWT, ISettings } from "../../rootReducer";
import { ISchema } from "../../interfaces/json-schema";
import { IData } from "../../interfaces/resource";
import { IResource } from "../../interfaces/resource";
import Form from "../../containers/Form";
import { createEmptyResource } from "../../utils/createEmpty";

interface ISeed {
  id: string;
  now: string;
}

interface IConnectedProps {
  jwt: IJWT;
  schema: { [key: string]: ISchema };
  data: IData;
  settings: ISettings;
  seed?: ISeed;
  push(location: any): any;
  messageToastr(message: string): any;
  errorToastr(message: string): any;
  resourceUpdated(): any;
}

interface IState {
  saving: boolean;
  data: IResource;
  validationErrors: any[];
}

type IProps = IConnectedProps & RouteComponentProps<{ resourceType: string }>;

export class EmptyResource extends React.PureComponent<IProps, IState> {
  form: any = null;

  constructor(props: IProps) {
    super(props);
    const resourceType = props.match.params.resourceType;
    const username = props.jwt.claims.sub;
    let primaryKey = v4();
    let now = moment()
      .utc()
      .format();
    if ("seed" in props && props.seed) {
      primaryKey = props.seed.id;
      now = props.seed.now;
    }
    const data = createEmptyResource(
      props.schema[resourceType],
      username,
      primaryKey,
      now
    );
    this.state = {
      saving: false,
      data,
      validationErrors: []
    };
  }

  asyncSetState = async (newState: any) => {
    return new Promise(resolve => {
      this.setState(newState, resolve);
    });
  };

  onChange = async (data: any) => {
    await this.asyncSetState({ data });
    await this.asyncSetState({
      validationErrors: this.form.getValidationErrors(),
      data
    });
  };

  save = () => {
    this.setState({ saving: true });
    const { resourceType } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    axios
      .post(`${backendUrl}/${resourceType}`, this.state.data, {
        headers: {
          Authorization: `Bearer ${this.props.jwt.token}`
        }
      })
      .then(response => {
        this.setState({ saving: false });
        this.props.resourceUpdated();
        if (response.status === 200) {
          this.props.messageToastr("Saved");
          const id = response.data.primaryKey.id;
          this.props.push(`/${resourceType}/${id}`);
        } else {
          this.props.errorToastr(JSON.stringify(response.data));
        }
      })
      .catch(response => {
        this.setState({ saving: false });
        this.props.errorToastr(JSON.stringify(response.response.data));
      });
  };

  render() {
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
          onClick={this.save}
        >
          {this.state.saving ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  }
}
