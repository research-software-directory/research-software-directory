import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

interface IProps {
  value: any[];
  label: string;
  onChange?(value: any): void;
}

export class StringArray extends React.Component<IProps, any> {
  lastInput: any;

  onAdd = (e: any) => {
    const value = [...this.props.value];
    value.push(e.target.value);
    if (this.props.onChange) {
       this.props.onChange(value);
    }
  }
  onRemove = (key: number) => () => {
    const value = [...this.props.value];
    value.splice(key, 1);
    if (this.props.onChange) {
       this.props.onChange(value);
    }
  }

  onInputChange = (key: number) => (e: any) => {
    const value = [...this.props.value];
    value[key] = e.target.value;
    if (this.props.onChange) {
       this.props.onChange(value);
    }
  }

  inputs = () => this.props.value.map((value, key) => (
    <InputGroup>
      <FormControl
        key={key}
        value={value}
        onChange={this.onInputChange(key)}
        ref={this.saveRef}
      />
      <span className="input-group-btn">
        <Button onClick={this.onRemove(key)}>
          <Glyphicon glyph="remove" />
        </Button>
      </span>
    </InputGroup>
  ))

  componentDidUpdate(prevProps: IProps) {
    if (this.props.value.length - prevProps.value.length === 1) {
      (ReactDOM.findDOMNode(this.lastInput) as any).focus();
    }
  }

  saveRef = (ref: any) => {
    this.lastInput = ref;
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>{this.props.label}</ControlLabel>
        {this.inputs()}
        <FormControl onChange={this.onAdd} value="" />
      </FormGroup>
    );
  }
}
