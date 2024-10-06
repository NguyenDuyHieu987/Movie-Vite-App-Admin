import { makeMediaRequest, makeRequest } from './makeRequest';
import type { AxiosProgressEvent } from 'axios';
import { Socket } from 'socket.io-client';

const PREFIX_ROUTE = 'videos';

export function getVideo(path: string) {
  const URL_VIDEO = import.meta.env.PROD
    ? import.meta.env.VITE_SERVER_VIDEO_URL
    : import.meta.env.VITE_SERVER_VIDEO_URL_DEV;

  return `${URL_VIDEO}/videos/${path}`;
}

export function getVideos(id: string) {
  return makeRequest(`/${PREFIX_ROUTE}/${id}`);
}

export function uploadVideo(
  type: string,
  file: File | Blob,
  socket: Socket,
  onDownloadProgress?: (e: AxiosProgressEvent) => void
) {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('socketId', socket.id!);
  formData.append('folder', type);

  return makeMediaRequest(
    `/video/upload`,
    {
      folder: type
    },
    {
      method: 'POST',
      data: formData
    },
    onDownloadProgress
  );
}
