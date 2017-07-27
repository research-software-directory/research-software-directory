import * as React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

interface IProps {
  value: any;
  label: string;
  onChange?(value: any): void;
}

export const TextInput = (props: IProps) => {
  const onChange = (e: any) => props.onChange && props.onChange(e.target.value);

  return (
    <FormGroup>
      <ControlLabel>{props.label}</ControlLabel>
      <FormControl
        value={props.value}
        onChange={onChange}
      />
    </FormGroup>
  );
};
