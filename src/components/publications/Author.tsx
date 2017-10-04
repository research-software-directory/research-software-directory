import * as React from 'react';

import { Segment, Button, Icon } from 'semantic-ui-react';

import { ResourceArray } from '../form/components/ResourceArray';
import {IPerson} from '../../interfaces/person';
import {IAuthor} from './actions';

interface IProps {
  people: IPerson[];
  creator: IAuthor;
  person: IPerson;
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

  toggleExpanded = (newState: boolean = !this.state.expanded) => () => {
    this.setState({expanded: newState});
  }

  onChange = (value: any) => {
    this.props.onChange(value);
    if (!value || !value.length) {
      this.toggleExpanded(false)();
    }
  }

  details = () => {
    const options = this.props.people.map((person) => ({
      id: person.id,
      label: person.name || person.id
    }));

    return (
        <ResourceArray
          label=""
          value={this.props.person ? [this.props.person] : []}
          onChange={this.onChange}
          options={options}
          resourceType="person"
          addable={false}
          maxItems={1}
        />
    );
  }

  noBubble = (f: any) => (e: any) => { f(e); e.preventDefault(); e.stopPropagation(); };

  foldBackButton = () => (
    <Button
      onClick={this.noBubble(this.toggleExpanded())}
      size="tiny"
      icon={true}
    >
      <Icon name="chevron up" />
    </Button>
  )

  render() {
    return (
      <Segment
        onClick={!this.state.expanded && this.toggleExpanded(true)}
        key={`${this.props.creator.lastName}${this.props.creator.firstName}`}
      >
        {this.props.creator.lastName}, {this.props.creator.firstName} &nbsp;
        {this.state.expanded && this.foldBackButton()}
        {this.props.person && <Icon style={{float: 'left'}} name="external square" />}
        {this.state.expanded && this.details()}
      </Segment>
    );
  }
}
