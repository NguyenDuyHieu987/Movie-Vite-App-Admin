import type { MovieForm } from '@/types';
import { makeRequest } from './makeRequest';

const PREFIX_ROUTE = 'movie';

export function getAllMovie(page: number = 1, limit: number = 20) {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    page,
    limit,
    no_cache: 1
  });
}

export function searchMovie(
  query: string,
  page: number = 1,
  limit: number = 20
) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
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

export function UpdateVideo(movieForm: MovieForm) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${movieForm.id}`, null, {
    method: 'POST',
    data: movieForm
  });
}

export function UpdateVideoPath(movieId: number | string, video_path: string) {
  return makeRequest(`/${PREFIX_ROUTE}/update-videopath/${movieId}`, null, {
    method: 'POST',
    data: {
      video_path
    }
  });
}

export function DeleteVideo(movieId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${movieId}`, null, {
    method: 'DELETE'
  });
}
