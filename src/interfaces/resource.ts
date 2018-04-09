export type IResource = {
  primaryKey: {
    id: string;
    collection: IResourceType;
  };
  updatedAt: string;
  createdAt: string;
  [key: string]: any;
};
export type IResourceType = string;
