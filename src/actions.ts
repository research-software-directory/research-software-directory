import { backend } from './services/async';

export const fetchRootJSON = () => backend.get('FETCH_ROOT_JSON', 'all');
export const fetchSchema = () => backend.get('FETCH_SCHEMA', 'schema');
