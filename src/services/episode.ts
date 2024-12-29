import type { EpisodeForm } from '@/types';
import { makeRequest } from './makeRequest';

const PREFIX_ROUTE = 'episode';

export function getListEpisode(
  movieId: string,
  seasonId: string,
  skip: number = 1,
  limit: number = 40,
  from: number = 1,
  to: number = 40
) {
  return makeRequest(`/${PREFIX_ROUTE}/list/${movieId}/${seasonId}`, {
    skip,
    limit,
    no_cache: 1
  });
}

export function getLatestEpisode(movieId: string, seasonId: string) {
  return makeRequest(`/${PREFIX_ROUTE}/latest/${movieId}/${seasonId}`);
}

export function getEpisode(
  movieId: string,
  seasonId: string,
  episodeNumber: number
) {
  return makeRequest(
    `/${PREFIX_ROUTE}/get/${movieId}/${seasonId}/${episodeNumber}`
  );
}

export function SearchEpisode(
  movieId: string,
  seasonId: string,
  query: string,
  skip: number = 1,
  limit: number = 20,
  from: number = 1,
  to: number = 40
) {
  return makeRequest(`/${PREFIX_ROUTE}/search/${movieId}/${seasonId}`, {
    query,
    skip,
    limit,
    no_cache: 1
  });
}

export function CreateEpisode(episodeForm: EpisodeForm) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: episodeForm
  });
}

export function UpdateVideo(episodeForm: EpisodeForm) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${episodeForm.id}`, null, {
    method: 'POST',
    data: episodeForm
  });
}

export function UpdateVideoUpload(
  episodeId: number | string,
  videoData: {
    video_path: string;
    duration: number;
  }
) {
  return makeRequest(`/${PREFIX_ROUTE}/update-videoupload/${episodeId}`, null, {
    method: 'POST',
    data: videoData
  });
}

export function DeleteEpisode(episodeId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${episodeId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleEpisode(listEpisodeId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listEpisodeId }
  });
}
