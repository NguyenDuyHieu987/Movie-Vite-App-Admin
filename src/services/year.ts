import type { year } from '@/types';
import { makeRequest } from './makeRequest';

const PREFIX_ROUTE = 'year';

export function getAllYear() {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    no_cache: 1
  });
}

export function SearchYear(query: string) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
    query,
    no_cache: 1
  });
}

export function CreateYear(yearForm: year) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: yearForm
  });
}

export function UpdateYear(yearForm: year) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${yearForm._id}`, null, {
    method: 'POST',
    data: yearForm
  });
}

export function DeleteYear(yearId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${yearId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleYear(listYearId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listYearId }
  });
}
