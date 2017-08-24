import * as React from 'react';

import { Auth } from './Auth';

import * as renderer from 'react-test-renderer';

import { Provider } from 'react-redux';

import { storeMock } from '../../services/testHelpers';

it('should render null without user', () => {
  const state = { auth: { user: null } };
  const store = storeMock(state);
  const component = renderer.create(<Provider store={store}><Auth><div id="dummy"/></Auth></Provider> );
  const result = component.toJSON();

  expect(result).toBeNull();
});

it('should contents with user', () => {
  const state = { auth: { user: { id: 'im_here' } } };
  const store = storeMock(state);
  const component = renderer.create(<Provider store={store}><Auth><div id="dummy"/></Auth></Provider> );
  const result = component.toJSON();

  expect(result).not.toBeNull();
  expect(result.props.id).toBe('dummy');
});
