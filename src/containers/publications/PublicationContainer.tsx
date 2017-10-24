import { connect } from 'react-redux';
import { setMapping } from './actions';
import { IPublication } from '../../interfaces/resources/publication';
import { IPerson } from '../../interfaces/resources/person';
import { Publication } from '../../components/publications/Publication';

interface IOwnProps {
  id: string;
}

interface IMappedProps {
  people: IPerson[];
  publication: IPublication;
  originalPublication: IPublication;
}

const dispatchToProps = { setMapping };

type IDispatchProps = typeof dispatchToProps;

const mapStateToProps = (state: any, ownProps: IOwnProps) => {
  return ({
    publication: state.current.data.publication.find((publication: any) => publication.id === ownProps.id),
    originalPublication: state.data.publication.find((publication: any) => publication.id === ownProps.id),
    people: state.current.data.person
  });
};

const connector = connect<IMappedProps, IDispatchProps, IOwnProps>(mapStateToProps, dispatchToProps);

export const PublicationContainer = connector(Publication);
