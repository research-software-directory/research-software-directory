import * as React from 'react';

import { Segment, Icon } from 'semantic-ui-react';

import { ResourceArray } from '../form/components/ResourceArray';

interface IProps {
  people: any;
  creator: any;
  person: any;
  onChange: any;
}

interface IState {
  expanded: boolean;
}

export class Author extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {expanded: false};
  }

  toggleExpanded = () => {
    this.setState({expanded: true});
  }

  details = () => {
    const options = this.props.people.map((resource: any) => ({
      id: resource.id,
      label: resource.name || resource.id
    }));

    return (
        <ResourceArray
          label=""
          value={this.props.person ? [this.props.person] : []}
          onChange={this.props.onChange}
          options={options}
          resourceType="person"
          addable={false}
          maxItems={1}
        />
    );
  }

  render() {
    return (
      <Segment onClick={this.toggleExpanded} key={`${this.props.creator.lastName}${this.props.creator.firstName}`}>
        {this.props.creator.lastName}, {this.props.creator.firstName}
        {this.props.person && <Icon style={{float: 'right'}} name="external square" />}
        {this.state.expanded && this.details()}
      </Segment>
    );
  }
}
