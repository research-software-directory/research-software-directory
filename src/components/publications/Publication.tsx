import * as React from 'react';
import { Segment, Message, Table } from 'semantic-ui-react';
import { Author } from './Author';
import { matchNames } from './matchNames';
import { IPublication } from '../../interfaces/resources/publication';
import { IPerson } from '../../interfaces/resources/person';
import { IAuthor } from '../../containers/publications/actions';

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

const propTable = (data: any) => {
  const propTableRow = (key: string, value: string) => (
    <Table.Row key={key}>
      <Table.Cell>{key}</Table.Cell>
      <Table.Cell>{value}</Table.Cell>
    </Table.Row>
  );

  const propTableRows = Object.keys(data).map((key: string) =>
    propTableRow(key, JSON.stringify(data[key])));

  return (
    <Table celled={true} striped={true}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={2}>Raw Data</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {propTableRows}
      </Table.Body>
    </Table>
  );
};

export class Publication extends React.PureComponent<IProps, IState> {
  constructor() {
    super();
    this.state = {noMap: false};
  }

  showAuthorsMessage = () => {
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
    if (props.publication.authors.filter((author: any) => !('person' in author)).length) {
      matchNames(props.people, props.publication.authors).forEach((author: any) => {
        props.setMapping(props.publication.id, author, author.person);
      });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({noMap : !nextProps.originalPublication});
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
      }
    );
  }

  render() {
    return (
      <div>
        <h1>
          {this.props.publication.title}
        </h1>
        {this.state.noMap && this.showAuthorsMessage()}
        <Segment.Group>
          {this.authors()}
        </Segment.Group>
        {propTable(this.props.publication)}
      </div>
    );
  }
}
