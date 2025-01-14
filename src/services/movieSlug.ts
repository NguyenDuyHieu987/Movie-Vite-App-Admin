import { useUtils } from '@/utils';
import { makeRequest } from './makeRequest';

import type { formfilter } from '@/types';

const PREFIX_ROUTE = 'movie';

export function getMovies(page: number = 1, limit: number = 12) {
  return makeRequest(`/${PREFIX_ROUTE}/all`, {
    page,
    limit
  });
}

export function getNowPlaying(page: number = 1, limit: number = 12) {
  return makeRequest(`/${PREFIX_ROUTE}/nowplaying`, {
    page,
    limit
  });
}

export function getPopular(page: number = 1, limit: number = 12) {
  return makeRequest(`/${PREFIX_ROUTE}/popular`, {
    page,
    limit
  });
}

export function getTopRated(page: number = 1, limit: number = 12) {
  return makeRequest(`/${PREFIX_ROUTE}/toprated`, {
    page,
    limit
  });
}

export function getUpComing(page: number = 1, limit: number = 12) {
  return makeRequest(`/${PREFIX_ROUTE}/upcoming`, {
    page,
    limit
  });
}

export function FilterMovieSlug(formFilter: formfilter) {
  const utils = useUtils();

  const isBefore = formFilter.year.toString().toLowerCase().startsWith('truoc');
  const isAfter = formFilter.year.toString().toLowerCase().startsWith('sau');

  const yearGte = !utils.isStringEmpty(formFilter.year.toString())
    ? utils.isNumber(formFilter.year)
      ? formFilter.year + '-01-01'
      : (isAfter
          ? (+formFilter.year.toString().slice(-4) + 1).toString()
          : formFilter.year.toString().slice(-4)) + '-01-01'
    : '';
  const yearLte = !utils.isStringEmpty(formFilter.year.toString())
    ? utils.isNumber(formFilter.year)
      ? formFilter.year + '-12-30'
      : formFilter.year.toString().slice(-4) + (isBefore ? '-01-01' : '-12-30')
    : '';

  // return utils.isStringNumber(formFilter.year) || formFilter.year == ''
  // ? makeRequest(
  //     `/${PREFIX_ROUTE}/discover/${formFilter.type}?sort_by=${formFilter.sortBy}&primary_release_date_gte=${yearGte}&primary_release_date_lte=${yearLte}&with_genres=${formFilter.genre}&with_original_language=${formFilter.country}&page=${formFilter.page}&limit=${formFilter.limit}`
  //   )
  // : makeRequest(
  //     `/${PREFIX_ROUTE}/discover/${formFilter.type}?sort_by=${formFilter.sortBy}&primary_release_date_lte=${yearGte}&with_genres=${formFilter.genre}&with_original_language=${formFilter.country}&page=${formFilter.page}&limit=${formFilter.limit}`
  //   );

  return makeRequest(`/${PREFIX_ROUTE}/discover/${formFilter.type}`, {
    sort_by: formFilter.sortBy,
    primary_release_date_gte: isBefore ? '' : yearGte,
    primary_release_date_lte: isAfter ? '' : yearLte,
    with_genres: formFilter.genre,
    with_original_language: formFilter.country,
    page: formFilter.page,
    limit: formFilter.limit
  });
}
