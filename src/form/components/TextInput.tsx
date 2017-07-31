import * as React from 'react';
import { Input, Segment } from 'semantic-ui-react';

interface IProps {
  value: any;
  label: string;
  className?: string;
  onChange?(value: any): void;
}

export const TextInput = (props: IProps) => {
  const onChange = (e: any) => props.onChange && props.onChange(e.target.value);

  return (
    <Segment>
      <p>{props.label}</p>
      <Input className={props.className || ''} value={props.value} onChange={onChange} />
    </Segment>
  );
};
