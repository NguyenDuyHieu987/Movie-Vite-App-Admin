import type { MovieForm } from '@/types';
import { makeRequest } from './makeRequest';

const PREFIX_ROUTE = 'movie';

export function GetAllMovie(
  media_type: string,
  page: number = 1,
  limit: number = 20
) {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    media_type,
    page,
    limit,
    no_cache: 1
  });
}

export function SearchMovie(
  media_type: string,
  query: string,
  page: number = 1,
  limit: number = 20
) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
    media_type,
    query,
    page,
    limit,
    no_cache: 1
  });
}

export function getMovieByType_Id(
  type: string,
  movieId: number | string,
  append_to_response: string = ''
) {
  return makeRequest(`/${PREFIX_ROUTE}/detail/${type}/${movieId}`, {
    append_to_response
  });
}

export function getMovieById(
  movieId: number | string,
  append_to_response: string = ''
) {
  return makeRequest(`/${PREFIX_ROUTE}/detail/${movieId}`, {
    append_to_response
  });
}

export function UpdateViewMovie(movieId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/update-view/${movieId}`, null, {
    method: 'POST'
  });
}

export function CreateMovie(movieForm: MovieForm) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: movieForm
  });
}

export function UpdateMovie(movieForm: MovieForm) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${movieForm.id}`, null, {
    method: 'POST',
    data: movieForm
  });
}

export function UpdateVideoUpload(
  movieId: number | string,
  videoData: {
    video_path: string;
    duration: number;
  }
) {
  return makeRequest(`/${PREFIX_ROUTE}/update-videoupload/${movieId}`, null, {
    method: 'POST',
    data: videoData
  });
}

export function DeleteMovie(movieId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${movieId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleMovie(listMovieId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listMovieId }
  });
}
