import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';

import { Provider } from 'react-redux';
import { configureStore } from './configureStore';

import * as renderer from 'react-test-renderer';
import { ReactTestRendererJSON } from 'react-test-renderer';

import * as fs from 'fs';
import * as path from 'path';

import { rootReducer } from './rootReducer';

const store = configureStore();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><App /></Provider>, div);
});

it('renders to null when logged out', () => {
  const component = renderer.create(
  <Provider store={store}><App /></Provider>
  );
  expect(component.toJSON()).toBeNull();
});

export const loadJSONMock = (filename: string) => {
  const mockPath = path.join(__dirname, 'mock');

  return JSON.parse(fs.readFileSync(`${mockPath}/${filename}`, 'utf8'));
};

export const storeMock = () => {
  const data   = loadJSONMock('data.json');
  const schema = loadJSONMock('schema.json');
  const user   = loadJSONMock('user.json');

  const defaultState = rootReducer({}, {type: 'INIT'});

  const state = {
    ...defaultState,
    auth: { user },
    current: { data, schema },
    data, schema
  };

  return {
    dispatch: jest.fn(),
    getState: jest.fn(() => state),
    replaceReducer: jest.fn(),
    subscribe: jest.fn()
  };
};

it('renders main menu with data loaded', () => {
  const component = renderer.create(
    <Provider store={storeMock()}><App /></Provider>
  );

  const comp = component.toJSON();
  expect (comp).not.toBeNull();
  expect (comp.type).toBe('div');

  expect(comp.children).not.toBeNull();
  if (comp.children) {
    const firstChild: ReactTestRendererJSON = comp.children[0] as ReactTestRendererJSON;
    expect(firstChild.props.id).toBe('main_menu');
  }
});
