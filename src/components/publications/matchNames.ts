import * as Fuse from 'fuse.js';

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

export const matchNames = (people: any[], authors: any[]) => {
  const _people = people.map((person: any) => {
    const nameParts = person.name.split(' ');

    return {
      id: person.id,
      name: person.name,
      firstName: nameParts[0],
      lastName: nameParts[nameParts.length - 1]
    };
  });

  const _authors = authors.map((author: any) => ({
    name: `${author.firstName} ${author.lastName}`,
    firstName: author.firstName,
    lastName: author.lastName
  }));

  const fuseByName = new Fuse(_people, options);

  _authors.forEach((author, index) => {
    const results = fuseByName.search(author.name);
    authors[index].person_id = (results.length > 0)
    ? (results[0] as any).item.id
    : null;
  });

  return authors;
};
