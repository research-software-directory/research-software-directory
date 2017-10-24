import { backend } from '../../services/async';

export const getNewProjects = () => backend.get('GET_NEW_PROJECTS', 'new_projects');
export const getNewPublications = () => backend.get('GET_NEW_PUBLICATIONS', 'new_publications');
export const getNewSoftware = () => backend.get('GET_NEW_SOFTWARE', 'new_software');

export const checkProjectID = (id: string) => ({type: 'CHECK_PROJECT_ID', id});
