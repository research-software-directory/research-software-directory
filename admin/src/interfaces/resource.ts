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

export interface IData {
  [key: string]: IResource[];
}
