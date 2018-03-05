import * as React from 'react';
import { Segment, Message } from 'semantic-ui-react';
import { Author } from './Author';
import { matchNames } from './matchNames';
import { IPublication } from '../../interfaces/resources/publication';
import { IPerson } from '../../interfaces/resources/person';
import { IAuthor } from '../../containers/publications/actions';
import { PropsTable } from '../PropsTable';

interface IProps {
  id: string;
  people: IPerson[];
  publication: IPublication;
  originalPublication: IPublication;
  setMapping(id: string, author: IAuthor, person: string): any;
}

interface IState {
  noMap: boolean;
}

export class Publication extends React.PureComponent<IProps, IState> {
  constructor() {
    super();
    this.state = {noMap: false};
  }

  authorsMessage = () => {
    return (
      <Message
        warning={true}
        icon="warning sign"
        header="Author <-> Person mapping"
        content="I tried to guess, please check below & confirm by saving."
      />
    );
  }

  autoMapAuthorPerson = (props = this.props) => {
    /* try to map props.publication.authors each to an existing person (props.people) */
    if (props.publication.authors.filter((author: any) => !('person' in author)).length) {
      matchNames(props.people, props.publication.authors).forEach((author: any) => {
        props.setMapping(props.publication.id, author, author.person);
      });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({noMap : !nextProps.originalPublication}); // publication was saved before
    if (nextProps.id !== this.props.id) {
      this.autoMapAuthorPerson(nextProps);
    }
  }

  componentWillMount() {
    this.autoMapAuthorPerson();
  }

  personSelected = (creator: any) => (person: string[]) => { // Author returns single value array
    this.props.setMapping(this.props.publication.id, creator, person[0]);
  }

  authors = () => {
    return this.props.publication.authors.map((creator: any, idx: number) => {
      const person = creator.person || null;

      return (
        <Author
          key={idx}
          creator={creator}
          person={person}
          people={this.props.people}
          onChange={this.personSelected(creator)}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h1>
          {this.props.publication.title}
        </h1>
        {this.state.noMap && this.authorsMessage()}
        <Segment.Group>
          {this.authors()}
        </Segment.Group>
        <PropsTable title="Raw Data" data={this.props.publication} />
      </div>
    );
  }
}
