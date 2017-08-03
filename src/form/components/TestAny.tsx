import * as React from 'react';

import { Segment } from 'semantic-ui-react';

import { EditableSegment } from './EditableSegment';

import { MultiSelect} from './MultiSelect';

import './testany.css';

const options = [
  { label: 'Tom', id: '/person/tom' },
  { label: 'Name2', id: '/person/name2' }
];

const value = [
  '/person/name2',
  { name: 'bladiebla' }
];

export class TestAny extends React.Component<{}, {}> {
  render() {
    const segments = value.map((val) =>
      (typeof val === 'string')
        ? <Segment>{JSON.stringify(val)}</Segment>
        : <EditableSegment value={val} />
    );

    return (
      <Segment>
        <Segment.Group style={{maxWidth: '500px'}}>
          {segments}
        </Segment.Group>
        <MultiSelect
          label={'Search'}
          options={options.filter((option) => value.indexOf(option.id) === -1).map((option) => ({ ...option, value: option.id}))}
          multi={false}
          search={true}
          addable={true}
          onChange={console.log}
          value={[]}
        />
      </Segment>
    );
  }
}
