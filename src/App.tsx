import * as React from 'react';

import './App.css';

import {Col, Well} from 'react-bootstrap';
import Form from 'react-jsonschema-form';

export class App extends React.Component<{}, { schema: object, formData: object }> {
  componentWillMount() {
    this.setState({});
    fetch('software.schema.json').then((data) => data.json()).then((data) =>
      this.setState({ schema : data })
    );
  }

  updateFormData = (data: any) => {
      this.setState({formData: data});
  }

  form = () => (
    <Form
        schema={this.state.schema}
        onChange={this.updateFormData}
        formData={this.state.formData}
    />
  )

  render() {
    return (
      <div className="App">
        <Col md={8}>
          {this.state.schema && this.form()}
        </Col>
        <Col md={4}>
          <Well>
            test
          </Well>
        </Col>
      </div>
    );
  }
}
