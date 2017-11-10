import { reducer } from '../../../containers/shared/resource/reducer';
import * as actions from '../../../containers/shared/resource/actions';

// it('should add value to property enums', () => {
//   const property = { software: { properties: { example: { items: { enum: ['first']}}}}};
//   const state = { property };
//   const result: any = reducer(state, actions.addToSchemaEnum('software', 'example', 'second'));
//   expect(result.property.software.properties.example.items.enum).toEqual(['first', 'second']);
// });

it('should update values', () => {
  const data = { software: [ {id: 'test', testField: 'testValue'} ] };
  const state = { data };
  const result: any = reducer(state, actions.updateField('software', 'test', 'testField', 'updatedValue'));
  expect(result.data.software[0].testField).toBe('updatedValue');
});

// it('should add new item', () => {
//   const data = { software: [ {id: 'test', testField: 'testValue'} ] };
//   const state = { data };
//   const property = { properties: {a: {type: 'string'}, b: {type: 'array'} } };
//   const result: any = reducer(state, createNewItem('software', 'newid', property));
//
//   expect(result.data.software).toHaveLength(2);
//   expect(result.data.software[0]).toEqual( { a: '', b: [], id: 'newid', name: 'newid' } );
// });
