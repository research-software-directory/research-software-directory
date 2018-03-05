import * as actions from './actions';
import * as update from 'immutability-helper';
import { IAuthor } from './actions';

export const reducer = (state: any = {}, action: actions.ISetMapping) => {
  if (action.type === actions.types.SET_MAPPING) {
    const publications = state.current.data.publication;
    const publication = publications.find((pub: any) => pub.id === action.id);
    const publicationIndex = publications.indexOf(publication);
    const author = publication.authors.find((auth: IAuthor) =>
      auth.firstName === action.author.firstName &&
      auth.lastName === action.author.lastName
    );
    const authorIndex = publication.authors.indexOf(author);

    return update(state, {
      current: {
        data: {
          publication:
            {[publicationIndex]: {authors: {[authorIndex]: {person: {$set: action.person}}}}}
        }
      }
    });
  }

  return state;
};
