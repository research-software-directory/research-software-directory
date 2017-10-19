import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount, configure } from 'enzyme';
import { DatePicker } from '../components/datepicker/DatePicker';

import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

const doNothing = () => null;

describe('<Datepicker />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <DatePicker
        value="2015-01-01"
        onChange={doNothing}
      />, div);
  });

  if (document) {
    // DatePicker uses Portal, which renders on `document`, so we need it in test env
    it('changes date', () => {
      const onChange = jest.fn();
      const component = mount(
        <DatePicker
          value="2016-01-15"
          onChange={onChange}
        />
      );
      component.find('button').simulate('click');
      // click first day of month
      [].slice.call(document.getElementsByClassName('DayPicker-Day'))
        .filter((day: any) => day.innerHTML === '1')[0].click();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toBeCalledWith('2016-01-01');
    });
  }
});
