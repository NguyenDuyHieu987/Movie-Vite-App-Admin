import { makeRequest } from './makeRequest';

import ALLCOUNTRIES from '@/constants/data/Country.json';
import type { country } from '@/types';

const PREFIX_ROUTE = 'country';

export function getAllCountry() {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    no_cache: 1
  });
}

export function SearchCountry(query: string) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
    query,
    no_cache: 1
  });
}

export function getCountryVietSub(
  original_language: string,
  allCountries: country[]
): country {
  if (allCountries?.length != 0) {
    return allCountries.find((country) => country.name === original_language)!;
  } else {
    return ALLCOUNTRIES.find(
      (country) => country.name === original_language
    )! as country;
  }
}

export function getCountryByShortName(
  country_short_name: string,
  allCountries: country[]
): country {
  if (allCountries?.length != 0) {
    return allCountries.find(
      (country) => country.short_name === country_short_name
    )!;
  } else {
    return ALLCOUNTRIES.find(
      (country) => country.short_name === country_short_name
    )! as country;
  }
}

export function getCountryByOriginalLanguage(
  original_language: string,
  allCountries: country[]
): country {
  if (allCountries?.length != 0) {
    return allCountries.find(
      (language) => language.iso_639_1 === original_language
    )!;
  } else {
    return ALLCOUNTRIES.find(
      (language) => language.iso_639_1 === original_language
    )! as country;
  }
}

export function CreateCountry(countryForm: country) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: countryForm
  });
}

export function UpdateCountry(countryForm: country) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${countryForm.iso_639_1}`, null, {
    method: 'POST',
    data: countryForm
  });
}

export function DeleteCountry(countryId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${countryId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleCountry(listCountryId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listCountryId }
  });
}
