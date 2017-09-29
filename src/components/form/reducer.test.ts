import { reducer } from './reducer';

import * as actions from './actions';

import {createNewItem} from '../menu/actions';

it('should add value to schema enums', () => {
  const schema = { software: { properties: { example: { items: { enum: ['first']}}}}};
  const state = { schema };
  const result: any = reducer(state, actions.addToSchemaEnum('software', 'example', 'second'));
  expect(result.schema.software.properties.example.items.enum).toEqual(['first', 'second']);
});

it('should update values', () => {
  const data = { software: [ {id: 'test', testField: 'testValue'} ] };
  const state = { data };
  const result: any = reducer(state, actions.updateField('software', 'test', 'testField', 'updatedValue'));
  expect(result.data.software[0].testField).toBe('updatedValue');
});

it('should add new item', () => {
  const data = { software: [ {id: 'test', testField: 'testValue'} ] };
  const state = { data };
  const schema = { properties: {a: {type: 'string'}, b: {type: 'array'} } };
  const result: any = reducer(state, createNewItem('software', 'newid', schema));

  expect(result.data.software).toHaveLength(2);
  expect(result.data.software[0]).toEqual( { a: '', b: [], id: 'newid', name: 'newid' } );
});
