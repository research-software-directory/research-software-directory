import * as React from 'react';

import { Segment } from 'semantic-ui-react';

import { DatePicker } from '../../datepicker/DatePicker';

interface IProps {
  label: string;
  value: string;
  onChange(value: string): void;
}

export const DateInput = (props: IProps) => (
  <Segment>
    <p dangerouslySetInnerHTML={{__html: props.label}}/>
    <DatePicker {...props} />
  </Segment>
);
