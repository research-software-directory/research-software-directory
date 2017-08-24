import * as React from 'react';
import { Segment, TextArea } from 'semantic-ui-react';

interface IProps {
  value: any;
  label: string;
  className?: string;
  onChange?(value: any): void;
}

export const TextAreaInput = (props: IProps) => {
  const onChange = (e: any) => props.onChange && props.onChange(e.target.value);

  return (
    <Segment>
      <p>{props.label}</p>
      <TextArea autoHeight={true} className={props.className || ''} value={props.value} onChange={onChange} />
    </Segment>
  );
};
