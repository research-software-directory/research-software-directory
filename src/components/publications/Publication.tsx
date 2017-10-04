import * as React from 'react';
import { connect } from 'react-redux';
import { Segment, Message, Table } from 'semantic-ui-react';
import { Author } from './Author';
import {matchNames} from './matchNames';
import {setMapping} from './actions';
import {IPublication} from '../../interfaces/publication';
import {IPerson} from '../../interfaces/person';

interface IOwnProps {
  id: string;
}

interface IMappedProps {
  people: IPerson[];
  publication: IPublication;
  originalPublication: IPublication;
}

interface IState {
  noMap: boolean;
}

type IDispatchProps = typeof dispatchToProps;

const dispatchToProps = { setMapping };

const mapStateToProps = (state: any, ownProps: IOwnProps) => {
  return ({
    publication: state.current.data.publication.find((publication: any) => publication.id === ownProps.id),
    originalPublication: state.data.publication.find((publication: any) => publication.id === ownProps.id),
    people: state.current.data.person
  });
};

const connector = connect<IMappedProps, IDispatchProps, IOwnProps>(mapStateToProps, dispatchToProps);

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

class PublicationsComponent extends React.PureComponent<IMappedProps & IOwnProps & IDispatchProps, IState> {
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

  autoMapAuthorPerson = () => {
    matchNames(this.props.people, this.props.publication.authors).forEach((author: any) => {
      this.props.setMapping(this.props.publication.id, author, author.person);
    });
  }

  componentWillReceiveProps(nextProps: IMappedProps & IOwnProps & IDispatchProps) {
    this.setState({noMap : !nextProps.originalPublication});
  }

  componentWillMount() {
    if (this.props.publication.authors.filter((author: any) => !('person' in author)).length) {
      this.autoMapAuthorPerson();
    }
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
        {this.state.noMap && this.showAuthorsMessage()}
        <Segment.Group>
          {this.authors()}
        </Segment.Group>
        {propTable(this.props.publication)}
      </div>
    );
  }
}

export const Publication = connector(PublicationsComponent);
