import * as React from 'react';
import { connect } from 'react-redux';
import { Segment, Message, Button, Table } from 'semantic-ui-react';
import { Author } from './Author';
import { setMapping, getMapping, saveMapping } from './actions';

interface IOwnProps {
  id: string;
}

interface IMappedProps {
  people: any;
  publication: any;
  authorPerson: any;
}

interface IDispatchProps {
  setMapping: any;
  getMapping: any;
  saveMapping: any;
}

const dispatchToProps = { setMapping, getMapping, saveMapping };

const mapStateToProps = (state: any, ownProps: IOwnProps) => {
  return ({
    publication: state.current.data.publication.find((publication: any) => publication.id === ownProps.id),
    people: state.current.data.person,
    authorPerson: state.authorPerson[ownProps.id]
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
          <Table.HeaderCell colSpan={2}>Data imported from Zotero</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {propTableRows}
      </Table.Body>
    </Table>
  );
};

class PublicationsComponent extends React.PureComponent<IMappedProps & IOwnProps & IDispatchProps, {}> {
  componentWillReceiveProps(newProps: IMappedProps & IOwnProps & IDispatchProps) {
    if (newProps.id !== this.props.id) {
      this.props.getMapping(newProps.id);
    }
  }

  componentWillMount() {
    this.props.getMapping(this.props.id);
  }
  showAuthorsMessage = () => {
    if (this.props.authorPerson && this.props.authorPerson.type === 'suggestion') {
      return (
        <Message
          warning={true}
          icon="warning sign"
          header="Authors mapping"
          content="Authors - People mapping needs review &amp; confirm."
        />
      );
    } else {
      return null;
    }
  }

  authors = () => {
    const onMapping = (creator: any) => (person: string[]) =>
      this.props.setMapping({ person : person[0], publication: this.props.publication._id, creator });

    return this.props.publication.creators.map((creator: any, idx: number) => {
      const map = this.props.authorPerson.mapping.find(
        (row: any) => row.creator.firstName === creator.firstName && row.creator.lastName === creator.lastName
      );
      const person = map ? map.person : null;

      return (
        <Author
          key={idx}
          creator={creator}
          person={person}
          people={this.props.people}
          onChange={onMapping(creator)}
        />
      );
      }
    );
  }

  saveMapping = () => {
    this.props.saveMapping(this.props.authorPerson);
  }

  render() {
    return (
      <div>
        {this.showAuthorsMessage()}
        <Button className="red" onClick={this.saveMapping}>Save</Button>
        <Segment.Group>
          {this.props.authorPerson && this.authors()}
        </Segment.Group>
        {propTable(this.props.publication)}
      </div>
    );
  }
}

export const Publication = connector(PublicationsComponent);
