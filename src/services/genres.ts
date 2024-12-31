import { makeRequest } from './makeRequest';

import ALLGENRES from '@/constants/data/Genres.json';
import type { genre } from '@/types';

const PREFIX_ROUTE = 'genre';

export function getAllGenre() {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    no_cache: 1
  });
}

export function SearchGenre(query: string) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
    query,
    no_cache: 1
  });
}

export function getGenreByShortName(
  genre_short_name: string,
  allGenres?: genre[]
): genre | undefined {
  if (allGenres?.length != 0) {
    return allGenres!.find((gen) => gen.short_name == genre_short_name);
  } else {
    return ALLGENRES.find((gen) => gen.short_name == genre_short_name) as genre;
  }
}

export function getGenreById(
  genre_id: number,
  allGenres?: genre[]
): genre | undefined {
  if (allGenres?.length != 0) {
    return allGenres!.find((gen) => gen.id == genre_id);
  } else {
    return ALLGENRES?.find((gen) => gen.id == genre_id) as genre;
  }
}

export function getGenreByName(
  genre_name: string,
  allGenres?: genre[]
): genre | undefined {
  if (allGenres?.length != 0) {
    return allGenres!.find((gen) => gen.name == genre_name);
  } else {
    return ALLGENRES.find((gen) => gen.name == genre_name) as genre;
  }
}

export function CreateGenre(genreForm: genre) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: genreForm
  });
}

export function UpdateGenre(genreForm: genre) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${genreForm.id}`, null, {
    method: 'POST',
    data: genreForm
  });
}

export function DeleteGenre(genreId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${genreId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleGenre(listGenreId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listGenreId }
  });
}
