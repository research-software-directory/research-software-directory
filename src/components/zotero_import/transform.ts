// transform transforms zotero Record to RSD resource

interface IZoteroCreator {
  creatorType: string;
  firstName: string;
  lastName: string;
}

export const transform = (zoteroRecord: any) =>
  ({
    id: zoteroRecord.key,
    zotero_key: zoteroRecord.key,
    doi: zoteroRecord.data.DOI,
    type: zoteroRecord.data.itemType,
    title: zoteroRecord.data.title,
    url: zoteroRecord.data.url,
    date: zoteroRecord.data.date,
    authors: zoteroRecord.data.creators.map((creator: IZoteroCreator) =>
      ({
        firstName: creator.firstName,
        lastName: creator.lastName
      })
    )
  });
