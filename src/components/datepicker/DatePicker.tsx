import * as React from 'react';
import * as moment from 'moment';

import { Overlay } from 'react-overlays';
import { ToolTip } from '../ToolTip';

// tslint:disable-next-line
const DayPicker = require('react-day-picker');
import 'react-day-picker/lib/style.css';

import { Button, Icon } from 'semantic-ui-react';

import {YearMonthForm} from './YearMonthForm';

interface IProps {
  value: string;
  onChange(value: string): void;
}

interface IState {
  daypickerOpen: boolean;
  currentDate: string;
}

export class DatePicker extends React.PureComponent<IProps, IState> {
  button = null;
  daypicker: any;

  componentWillMount() {
    this.setState({
      daypickerOpen: false,
      currentDate: this.props.value || '2011-01-01'
    });
  }

  onDateChange = (m: Date) => {
    this.props.onChange(moment(m).format('YYYY-MM-DD'));
    this.toggleDaypicker();
  }
  setButtonRef = (component: any) => { this.button = component; };
  setDaypickerRef = (component: any) => { this.daypicker = component; };
  toggleDaypicker = () => {
    this.setState({daypickerOpen: !this.state.daypickerOpen});
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
