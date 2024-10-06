import { isString, useUtils } from '@/utils';
import { makeRequest, makeMediaRequest } from './makeRequest';
import { isProduction } from 'std-env';

// export const SERVER_IMAGE = 'https://ik.imagekit.io/8toa5f2rp';
// export const DEV_SERVER_IMAGE = 'http://localhost:5002/static';
export const SERVER_IMAGE = 'https://media.phimhay247z.org';
export const DEV_SERVER_IMAGE = 'http://localhost:5002';

const PREFIX_ROUTE = 'images';

export function getImage(
  path: string,
  type: string,
  crop?:
    | { w?: number; h?: number; crop_size?: string; quality?: number }
    | string
): string {
  const utils = useUtils();

  const URL_IMAGE = import.meta.env.PROD
    ? import.meta.env.VITE_SERVER_IMAGE_URL
    : import.meta.env.VITE_SERVER_IMAGE_URL_DEV;

  if (utils.isStringEmpty(path)) return URL_IMAGE!;

  if (!crop) {
    return `${URL_IMAGE}/images/${type}/${path}`;
  }

  if (isString(crop)) {
    const cropStr = crop as string;
    // const w = cropStr.replace('-', '=');
    // const h = cropStr.replace('-', '=');
    // return `${URL_IMAGE}/images/${type}/${path}?${w}&${h}`;
    return `${URL_IMAGE}/images/${type}/${path}/tr:${cropStr}`;
  } else {
    crop = {
      crop_size: 'auto',
      quality: 80,
      ...(crop as object)
    };
  }

  return `${URL_IMAGE}/images/${type}/${path}?${utils.serialize(crop)}`;
}

export function getServerImage(
  path: string,
  type: string,

  crop?:
    | { w?: number; h?: number; crop_size?: string; quality?: number }
    | string
): string {
  const utils = useUtils();

  const URL_IMAGE = isProduction ? SERVER_IMAGE : DEV_SERVER_IMAGE;

  if (utils.isStringEmpty(path)) return URL_IMAGE;

  if (isString(crop)) {
    const cropStr = crop as string;
    // const w = cropStr.replace('-', '=');
    // const h = cropStr.replace('-', '=');
    // return `${URL_IMAGE}/images/${type}/${path}?${w}&${h}`;
    return `${URL_IMAGE}/images/${type}/${path}/tr:${cropStr}`;
  } else {
    crop = {
      crop_size: 'auto',
      quality: 80,
      ...(crop as object)
    };
  }

  return `${URL_IMAGE}/images/${type}/${path}?${utils.serialize(crop)}`;
}

export function getPosterCast(path: string): string {
  const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  return `${TMDB_IMAGE_BASE_URL}/original${path}`;
}

export function getColorImage(path: string) {
  return makeMediaRequest(`/image/color/backdrop/${path}`);
}

export function uploadImage(type: string, file: File | Blob) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', type);

  return makeMediaRequest(
    `/image/upload`,
    {
      folder: type
    },
    {
      method: 'POST',
      data: formData
    }
  );
}

export function uploadArrayImage(
  data: { folder: string; file: File | Blob }[]
) {
  const formData = new FormData();
  data.forEach((item, index) => {
    formData.append(`data[${index}]`, JSON.stringify(item));
    formData.append(`images`, item.file);
  });
  return makeMediaRequest(`/image/upload`, null, {
    method: 'POST',
    data: formData
  });
}

export function getImages(id: string) {
  return makeRequest(`/${PREFIX_ROUTE}/${id}`);
}
