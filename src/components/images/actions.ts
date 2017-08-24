import { backend } from '../../services/async';

export const imageUpload = (file: File) => backend.upload('UPLOAD_IMAGE', file);
export const loadImages = () => backend.get('GET_IMAGES', 'images');
