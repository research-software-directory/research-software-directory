import * as React from 'react';

import { Segment } from 'semantic-ui-react';

import { DatePicker } from '../../DatePicker';

interface IProps {
  label: string;
  value: string;
  onChange(value: string): void;
}

export const DateInput = (props: IProps) => (
  <Segment>
    {props.label} <br />
    <DatePicker {...props} />
  </Segment>
);
