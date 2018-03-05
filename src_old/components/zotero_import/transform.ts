// transform transforms zotero Record to RSD resource

import { splitNames } from '../../services/util';

interface IBaseCreator {
  person?: string; // added property, mapping to RSD person
  creatorType: 'author' | 'presenter' | 'contributor';
}

interface ISplitNamesCreator extends IBaseCreator {
  firstName: string;
  lastName: string;
}

interface ISingleNameCreator extends IBaseCreator {
  name: string;
}

export type IZoteroCreator = ISplitNamesCreator | ISingleNameCreator;

export function isSingleNamesCreator(creator: IZoteroCreator): creator is ISingleNameCreator {
  return (<ISingleNameCreator> creator).name !== undefined;
}

export function isSplitNamesCreator(creator: IZoteroCreator): creator is ISplitNamesCreator {
  return (<ISplitNamesCreator> creator).firstName !== undefined;
}

export const transformPublication = (zoteroRecord: any) => {
  return ({
    id: zoteroRecord.key,
    zoteroKey: zoteroRecord.key,
    doi: zoteroRecord.data.DOI,
    type: zoteroRecord.data.itemType,
    title: zoteroRecord.data.title,
    url: zoteroRecord.data.url,
    date: zoteroRecord.data.date,
    original: zoteroRecord.data,
    authors: zoteroRecord.data.creators.map((creator: IZoteroCreator) => {
      if (isSplitNamesCreator(creator)) {
        return ({
          firstName: creator.firstName,
          lastName: creator.lastName
        });
      } else {
        const nameParts = splitNames(creator.name);
        return ({
          firstName: nameParts[0],
          lastName: nameParts[1]
        });
      }
    })
  });
};

export const transformSoftware = (zoteroRecord: any): any => { // see ISoftware
  let attributes = {
    zoteroKey: zoteroRecord.key,
    doi: zoteroRecord.data.DOI,
    name: zoteroRecord.data.title,
    description: zoteroRecord.data.abstractNote,
    schema: 'software'
  };

  if (zoteroRecord.data.githubid) {
    Object.assign(attributes, {
      githubid: zoteroRecord.data.githubid,
      codeRepository: `https://github.com/${zoteroRecord.data.githubid}`,
      website: `https://github.com/${zoteroRecord.data.githubid}`
    });
  }

  if (zoteroRecord.data.doi) {
    attributes.doi = zoteroRecord.data.doi;
  }

  return attributes;
};

export const transformProject = (zoteroRecord: any): any => {
  return {
    name: zoteroRecord.name.split(' ').slice(1).join(' '),
    zoteroKey: zoteroRecord.zoteroKey,
    projectCode: zoteroRecord.projectCode
  };
};