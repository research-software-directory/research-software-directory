import * as React from 'react';
import axios from 'axios';

import { RouteComponentProps } from 'react-router';
import { Message, Button, Tab } from 'semantic-ui-react';

import { debounce } from '../../utils/debounce';
import { IJWT, ISettings } from '../../rootReducer';
import { ISchema } from '../../interfaces/json-schema';
import { IData } from '../../interfaces/misc';
import { IResource } from '../../interfaces/resource';
import JsonEditor from './JsonEditor';
import Form from '../../containers/Form';

const VALIDATE_DEBOUNCE_TIME = 500; // ms

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
  valid: boolean | null;
  validationError: any;
}

type IProps = IConnectedProps & RouteComponentProps<{resourceType: string, id: string}>;

const validationMessage = (valid: boolean | null, validationError: string | null) => {
  if (valid) {
    return (
      <Message
        success={true}
        header="Data valid"
        content="Data has been validated"
      />
    );
  } else if (valid === false) {
    return (
      <Message
        negative={true}
        header="Invalid"
        content={validationError}
      />
    );
  } else {
    return (
      <Message
        color="yellow"
        header="Validating..."
        content="Validating data"
      />
    );
  }
};

export default class extends React.PureComponent<IProps, IState> {
  form: any = null;
  editor: JsonEditor | null = null;

  validate = debounce(
    (s: string) => {
      if (!this.isValidJSON(s)) {
        this.setState({
          valid: false,
          validationError: 'Syntax error'
        });
      } else {
        const { resourceType, id } = this.props.match.params;
        const { backendUrl } = this.props.settings;
        axios.patch(`${backendUrl}/${resourceType}/${id}?test`, s, {
          headers: {
            Authorization: `Bearer ${this.props.jwt.token}`
          }
        }).then(() => {
          this.setState({valid: true});
        }).catch(response => {
          this.setState({valid: false, validationError:
            `${(response.response.data.path || []).join(' -> ')}: ${response.response.data.error}`
          });
        });
      }
    },
    VALIDATE_DEBOUNCE_TIME
  );

  save(s: string) {
    this.setState({saving: true});
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    axios.patch(`${backendUrl}/${resourceType}/${id}?save_history`, s, {
      headers: {
        Authorization: `Bearer ${this.props.jwt.token}`
      }
    }).then(() => {
      this.setState({saving: false});
      this.props.messageToastr('Saved');
    }).catch(response => {
      this.setState({saving: false});
      this.props.errorToastr(JSON.stringify(response));
    });
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      saving: false,
      loading: true,
      data: null,
      valid: true,
      validationError: null,
    };
  }

  async getData() {
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    const result = await axios.get(`${backendUrl}/${resourceType}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.props.jwt.token}`
      }
    });
    this.setState({data: result.data, loading: false, valid: null});
    this.validate(JSON.stringify(result.data));
  }

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(props: IProps) {
    console.log(props);
  }

  isValidJSON(s: string) {
    try {
      JSON.parse(s);
    } catch {
      return false;
    }
    return true;
  }

  onChange(s: string) {
    this.setState({valid: null});
    this.validate(s);
  }

  render() {
    if (this.state.loading) {
      return null;
    }
    const panes = [
      { menuItem: 'JSON editor', render: () =>  (
        <Tab.Pane style={{flex: 1}}>
          <JsonEditor
            ref={elm => this.editor = elm}
            value={JSON.stringify(this.state.data, null, 2)}
            onChange={(s: string) => this.onChange(s)}
          />
        </Tab.Pane>
        ) },
      { menuItem: 'Form', render: () => (
        <Tab.Pane style={{flex: 1, overflowY: 'scroll'}}>
          <Form
            ref={elm => this.form = elm}
            value={this.state.data!}
            onChange={(data: any) => this.onChange(JSON.stringify(data))}
          />
        </Tab.Pane>
        ) },
    ];

    return (
      <div>
        <div style={{height: 'calc(100vh - 200px)'}}>
          <Tab style={{display: 'flex', flexDirection: 'column', height: '100%'}} panes={panes} />
        </div>
        {validationMessage(this.state.valid, this.state.validationError)}
        <Button
          disabled={!this.state.valid || this.state.saving}
          onClick={() => this.save(this.editor && this.editor.getValue())}
        >
          {this.state.saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    );
  }
}
