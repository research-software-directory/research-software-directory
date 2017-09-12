import * as fs from 'fs';
import * as path from 'path';

import { rootReducer } from './rootReducer';

export const loadJSONMock = (filename: string) => {
  const mockPath = path.join(__dirname, '..', 'mock');

  return JSON.parse(fs.readFileSync(`${mockPath}/${filename}`, 'utf8'));
};

const mockedState = () => {
  const data   = loadJSONMock('data.json');
  const schema = loadJSONMock('schema.json');
  const user   = loadJSONMock('user.json');

  const defaultState = rootReducer({}, {type: 'INIT'});

  return {
    ...defaultState,
    auth: { user },
    current: { data, schema },
    data, schema
  };
};

export const storeMock = (state: object = mockedState()) => {
  return {
    dispatch: jest.fn(),
    getState: jest.fn(() => state),
    replaceReducer: jest.fn(),
    subscribe: jest.fn()
  };
};
