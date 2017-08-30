import * as React from 'react';

import { Button, Icon, Dropdown } from 'semantic-ui-react';

import * as DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { Overlay } from 'react-overlays';

import { ToolTip } from './ToolTip';

import * as moment from 'moment';

interface IProps {
  value: string;
  onChange(value: string): void;
}

interface IState {
  daypickerOpen: boolean;
  currentDate: string;
}

const YearMonthForm = (props: {year: number, month: number, onChange: any}) => {
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

export class DatePicker extends React.Component<IProps, IState> {
  button = null;
  daypicker: any;

  componentWillMount() {
    this.state = {
      daypickerOpen: false,
      currentDate: this.props.value || '2011-01-01'
    };
  }

  onDateChange = (m: Date) => {
    this.props.onChange(moment(m).format('YYYY-MM-DD'));
    this.toggleDaypicker();
  }
  setButtonRef = (component: any) => { this.button = component; };
  setDaypickerRef = (component: any) => { this.daypicker = component; };
  toggleDaypicker = () => {
    const isOpen = !this.state.daypickerOpen;
    this.setState({daypickerOpen: isOpen});
  }

  handleYearMonthChange = (year: number, month: number) => {
    const newDate = moment();
    newDate.year(year);
    newDate.month(month);
    newDate.day(1);
    this.setState({currentDate: moment(newDate).format('YYYY-MM-DD')});
    this.daypicker.showMonth(moment(newDate).toDate());
  }

  handleMonthNav = (m: any) => {
    this.setState({currentDate: moment(m).format('YYYY-MM-DD')});
  }

  render() {
    const yearMonthForm = (
      <YearMonthForm
        year={moment(this.state.currentDate).toDate().getFullYear()}
        month={moment(this.state.currentDate).toDate().getMonth()}
        onChange={this.handleYearMonthChange}
      />
    );

    const dayPicker = (
      <DayPicker
        ref={this.setDaypickerRef}
        selectedDays={moment(this.props.value).toDate()}
        initialMonth={moment(this.state.currentDate).toDate()}
        onDayClick={this.onDateChange}
        onMonthChange={this.handleMonthNav}
        captionElement={yearMonthForm}
      />
    );

    return (
      <div>
        <Button onClick={this.toggleDaypicker} ref={this.setButtonRef}>
          <Icon name="calendar" /> {moment(this.props.value).format('YYYY-MM-DD')}
        </Button>
        <Overlay
          onHide={this.toggleDaypicker}
          rootClose={true}
          target={this.button}
          placement="right"
          show={this.state.daypickerOpen}
        >
          <ToolTip>
            {dayPicker}
          </ToolTip>
        </Overlay>
      </div>
    );
  }
}
