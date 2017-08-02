import * as React from 'react';

import { Button, Segment } from 'semantic-ui-react';

import { MultiSelect} from './MultiSelect';

const options = [
  { label: 'Tom', id: '/person/tom' },
  { label: 'Name2', id: '/person/name2' }
];

const value = [
  '/person/name2',
  { name: 'bladiebla' }
];

export class TestAny extends React.Component<{}, {}> {

  renderValues() {
    const segments = value.map((val) => (
      <Segment>
        {JSON.stringify(val)}
        <Button size="mini" floated="right" icon="close"/>
      </Segment>
    ));

    return (
      <Segment.Group style={{maxWidth: '500px'}}>
        {segments}
      </Segment.Group>
    );
  }

  render() {
    // const props = {...this.defaults, ...this.props};

    return (
      <Segment>
        {this.renderValues()}
        <MultiSelect
          label={'bladiebla'}
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
