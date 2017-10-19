import * as React from 'react';
import { AuthContainer } from '../index';
import * as renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { storeMock } from '../../../tests/testHelpers';

it('should render null without user', () => {
  const state = { auth: { user: null } };
  const store = storeMock(state);
  const component = renderer.create(
    <Provider store={store}><AuthContainer><div id="dummy"/></AuthContainer></Provider>
  );
  const result = component.toJSON();

  expect(result).toBeNull();
});

it('should contents with user', () => {
  const state = { auth: { user: { id: 'im_here' } } };
  const store = storeMock(state);
  const component = renderer.create(
    <Provider store={store}><AuthContainer><div id="dummy"/></AuthContainer></Provider>
  );
  const result = component.toJSON();

  expect(result).not.toBeNull();
  if (result) {
    expect(result.props.id).toBe('dummy');
  }
});
