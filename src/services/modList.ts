import { useUtils } from '@/utils';
import { makeRequest } from './makeRequest';
import { FilterMovie } from './discover';
import type { formfilter, modList } from '@/types';

const PREFIX_ROUTE = 'modlist';

export function getAllModList(
  type: string = 'all',
  page: number = 1,
  limit: number = 20
) {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    type,
    page,
    limit,
    no_cache: 1
  });
}

export function SearchModList(
  query: string,
  type: string = 'all',
  page: number = 1,
  limit: number = 20
) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
    query,
    type,
    page,
    limit,
    no_cache: 1
  });
}

export function FilterModList(formFilter: formfilter) {
  const utils = useUtils();

  if (utils.isStringEmpty(formFilter.slug) || formFilter.slug == 'all') {
    return FilterMovie(formFilter);
  }

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

  return makeRequest(
    `/${PREFIX_ROUTE}/filter/${formFilter.type}/${formFilter.slug}`,
    {
      // slug: formFilter.slug,
      sort_by: formFilter.sortBy,
      primary_release_date_gte: isBefore ? '' : yearGte,
      primary_release_date_lte: isAfter ? '' : yearLte,
      with_genres: formFilter.genre,
      with_original_language: formFilter.country,
      page: formFilter.page,
      limit: formFilter.limit
    }
  );
}

export function CreateModList(accountForm: modList) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: accountForm
  });
}

export function UpdateModList(accountForm: modList) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${accountForm._id}`, null, {
    method: 'POST',
    data: accountForm
  });
}

export function DeleteModList(accountId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${accountId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleModList(listModListId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listModListId }
  });
}
