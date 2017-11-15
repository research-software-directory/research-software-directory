import * as React from 'react';
import { Checkbox, Segment } from 'semantic-ui-react';

interface IProps {
  value: boolean;
  label: string;
  className?: string;
  onChange?(value: any): void;
}

export const BooleanInput = (props: IProps) => {
  const onChange = (_: any, data: any) => props.onChange && props.onChange(data.checked);

  return (
    <Segment>
      <p dangerouslySetInnerHTML={{__html: props.label}}/>
      <Checkbox toggle={true} className={props.className || ''} checked={!!props.value} onChange={onChange} />
    </Segment>
  );
};
