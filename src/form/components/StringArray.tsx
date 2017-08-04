import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Input, Segment} from 'semantic-ui-react';

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
      <div key={key}>
        <Input
          value={value}
          onChange={this.onInputChange(key)}
          ref={this.saveRef}
          action={<Button onClick={this.onRemove(key)} icon="remove"/>}
        />
      </div>
  ))

  componentDidUpdate(prevProps: IProps) {
    if (this.props.value.length - prevProps.value.length === 1) {
      (ReactDOM.findDOMNode(this.lastInput).firstChild as any).focus();
    }
  }

  saveRef = (ref: any) => {
    this.lastInput = ref;
  }

  render() {
    return (
      <div>
        <Segment>
          {this.props.label}<br />
            {this.inputs()}
          <Input onChange={this.onAdd} value="" />
        </Segment>
      </div>
    );
  }
}
