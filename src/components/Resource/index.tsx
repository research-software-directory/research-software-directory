import * as React from "react";
import axios from "axios";

import { RouteComponentProps } from "react-router";
import { Button, Message, Modal, Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

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

type IProps = IConnectedProps &
  RouteComponentProps<{ resourceType: string; id: string }>;

class DeleteModal extends React.PureComponent<
  IProps,
  { modalOpen: boolean; links: any[]; error: string | null }
> {
  constructor(props: IProps) {
    super(props);
    this.state = { modalOpen: false, links: [], error: null };
  }

  confirmDelete() {
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;

    axios
      .delete(`${backendUrl}/${resourceType}/${id}`, {
        headers: {
          Authorization: `Bearer ${this.props.jwt.token}`
        }
      })
      .then(() => {
        this.setState({ modalOpen: false, links: [], error: null });
        this.props.messageToastr("Deleted");
      })
      .catch(response => {
        const result = response.response;
        if (result && result.status === 406) {
          this.setState({ links: result.data.data, error: result.data.error });
        } else {
          this.setState({ links: [], error: result.data.error });
        }
      });
  }

  formatLink(linkArr: any[]): any {
    const linkParts = [...linkArr];
    const resourceType = linkParts.shift();
    const id = linkParts.shift();
    return (
      <div>
        <Link to={`/${resourceType}/${id}`}>{`/${resourceType}/${id}`}</Link>
        {linkParts
          .map(part => (typeof part === "string" ? ` => ${part}` : `[${part}]`))
          .join("")}
      </div>
    );
  }

  render() {
    return (
      <Modal
        trigger={
          <Button
            color="red"
            onClick={() => this.setState({ modalOpen: true })}
          >
            Delete
          </Button>
        }
        open={this.state.modalOpen}
        onClose={() => this.setState({ modalOpen: false })}
        size="small"
        style={{
          marginTop: "0px !important",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <Header icon="delete" content="Deleting" />
        <Modal.Content>
          <p>Are you sure you want to delete this?</p>
          {this.state.error && (
            <Message
              error={true}
              header={this.state.error}
              list={this.state.links.map(this.formatLink)}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => this.confirmDelete()}>
            <Icon name="remove" /> Yes, delete
          </Button>
          <Button
            onClick={() => this.setState({ modalOpen: false })}
            inverted={true}
            color="green"
          >
            <Icon name="checkmark" /> No
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

interface IState {
  loading: boolean;
  saving: boolean;
  data: IResource | null;
  validationErrors: any[];
}

export default class Resource extends React.PureComponent<IProps, IState> {
  form: any = null;

  save = () => {
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
  };

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
          primary={true}
          disabled={this.state.saving || this.state.validationErrors.length > 0}
          onClick={this.save}
        >
          {this.state.saving ? "Saving..." : "Save"}
        </Button>
        <DeleteModal {...this.props} />
      </div>
    );
  }
}
