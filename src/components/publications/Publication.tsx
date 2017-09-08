import * as React from 'react';
import { connect } from 'react-redux';
import { Segment, Message } from 'semantic-ui-react';
import { Author } from './Author';
import { setMapping, getMapping } from './actions';

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
}

const dispatchToProps = { setMapping, getMapping };

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
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  );

  const propTableRows = Object.keys(data).map((key: string) =>
    propTableRow(key, JSON.stringify(data[key])));

  return (
    <table>
      <tbody>
        {propTableRows}
      </tbody>
    </table>
  );
};

class PublicationsComponent extends React.PureComponent<IMappedProps & IOwnProps & IDispatchProps, {}> {
  componentWillReceiveProps(newProps: IMappedProps & IOwnProps & IDispatchProps) {
    if (newProps.id !== this.props.id) {
      this.props.getMapping(this.props.id);
    }
  }

  componentWillMount() {
    this.props.getMapping(this.props.id);
  }
  showAuthorsMessage = () => {
    if (!this.props.publication.authorsMapped) {
      return (
        <Message>
          <Message.Header>
            Authors mapping
          </Message.Header>
          <p>
            Authors - People mapping needs review &amp; confirm.
          </p>
        </Message>
      );
    } else {
      return null;
    }
  }

  authors = () => {
    const onMapping = (creator: any) => (person: string[]) =>
      this.props.setMapping({ person : person[0], publication: this.props.publication._id, creator });

    return this.props.publication.creators.map((creator: any, idx: number) => {
      const map = this.props.authorPerson.find(
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

  render() {
    return (
      <div>
        {this.showAuthorsMessage()}
        <Segment.Group>
          {this.props.authorPerson && this.authors()}
        </Segment.Group>
        {propTable(this.props.publication)}
      </div>
    );
  }
}

export const Publication = connector(PublicationsComponent);
