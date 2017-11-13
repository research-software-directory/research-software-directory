import * as Fuse from 'fuse.js';
import { IPerson } from '../../interfaces/resources/person';
import { IAuthor } from '../../containers/publications/actions';
import { splitNames } from '../../services/util';

const options = {
  shouldSort: true,
  threshold: 0.4,
  includeScore: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name'
  ]
};

export const matchNames = (people: IPerson[], authors: IAuthor[]) => {
  const _people = people.map((person: any) => {
    const nameParts = splitNames(person.name);

    return {
      id: person.id,
      name: person.name,
      firstName: nameParts[0],
      lastName: nameParts[1]
    };
  });

  const splitNameWithComma = (name: string) => {
    const authorParts = name.split(',');
    return ({
      name: `${authorParts[1]} ${authorParts[0]}`,
      firstName: authorParts[1],
      lastName: authorParts[0]
    });
  };

  const _authors = authors.map((author: any) => {
    if (author.firstName.indexOf(',') !== -1) {
      return splitNameWithComma(author.firstName);
    }
    if (author.lastName.indexOf(',') !== -1) {
      return splitNameWithComma(author.lastName);
    }
    return ({
      name: `${author.firstName} ${author.lastName}`,
      firstName: author.firstName,
      lastName: author.lastName
    });
  });

  const fuseByName = new Fuse(_people, options);

  _authors.forEach((author, index) => {
    const results = fuseByName.search(author.name);
    authors[index].person = (results.length > 0)
    ? (results[0] as any).item.id
    : null;
  });

  return authors;
};
