import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { ReactTestRendererJSON } from 'react-test-renderer';

import { App } from './App';
import { store } from './store';
import { storeMock } from './testHelpers';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={storeMock()}><App /></Provider>, div);
});

it('renders loader when logged out', () => {
  const component = mount(
  <Provider store={store}><App /></Provider>
  );
  component.find('ui text loader');
});

it('renders main menu with data loaded', () => {
  const component = renderer.create(
    <Provider store={storeMock()}><App /></Provider>
  );

  const comp = component.toJSON();
  expect (comp).not.toBeNull();
  if (comp) {
    expect(comp.type).toBe('div');

    expect(comp.children).not.toBeNull();
    if (comp.children) {
      const firstChild: ReactTestRendererJSON = comp.children[0] as ReactTestRendererJSON;
      expect(firstChild.props.id).toBe('main_menu');
    }
  }
});
