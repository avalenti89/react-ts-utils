import { blobToBase64 } from './blobToBase64';

export const fileToBase64 = (file: File) => blobToBase64(file);
