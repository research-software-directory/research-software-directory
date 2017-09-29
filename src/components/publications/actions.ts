import { backend } from '../../services/async';

export const setMapping = (payload: any) => ({type: 'SET_AUTHOR_MAPPING', payload});
export const getMapping = (id: string) => backend.get('GET_AUTHOR_MAPPING', `author_mapping${id}`);
export const saveMapping = (payload: any) => backend.post('SAVE_AUTHOR_MAPPING', 'save_author_mapping', payload );
