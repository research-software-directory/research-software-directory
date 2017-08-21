import { backend, IFetchAction } from './async';

export const fetchRootJSON: IFetchAction = backend.get('FETCH_ROOT_JSON', 'all');
export const fetchSchema: IFetchAction = backend.get('FETCH_SCHEMA', 'schema');

export const uploadProgress = (id: number, percentage: number) => ({
  id,
  percentage,
  type: 'UPLOAD_PROGRESS'
});
