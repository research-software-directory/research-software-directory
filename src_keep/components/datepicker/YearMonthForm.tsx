import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';

type IOnChange = (year: number, month: number) => any;

export const YearMonthForm = (props: {year: number, month: number, onChange: IOnChange}) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const months = [];
  for (let i = 0; i < 12; i += 1) {
    months.push({
      text: monthNames[i],
      value: i
    });
  }

  const years = [];
  for (let i = 1950; i <= 2050; i += 1) {
    years.push({
      text: i.toString(),
      value: i
    });
  }

  const monthChange = (e: any, option: any) => e && props.onChange(props.year, option.value);
  const yearChange = (e: any, option: any) => e && props.onChange(option.value, props.month);

  return (
    <div style={{display: 'table-caption', width: '80%', margin: '0 auto', marginTop: '-.8em'}}>
      <Dropdown
        name="month"
        onChange={monthChange}
        value={props.month}
        options={months}
        selection={true}
        style={{width: '100%', minWidth: 0}}
      />
      <Dropdown
        name="year"
        onChange={yearChange}
        value={props.year}
        options={years}
        selection={true}
        style={{width: '100%', minWidth: 0}}
      />
    </div>
  );
};