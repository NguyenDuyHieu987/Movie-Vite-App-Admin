import type { Broadcast } from '@/types';
import { makeRequest } from './makeRequest';

const PREFIX_ROUTE = 'broadcast';

export function getAllBroadcast(page: number = 1, limit: number = 20) {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    page,
    limit,
    no_cache: 1
  });
}

export function SearchBroadcast(
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

export function getAllAiringBroadcast(page: number = 1, limit: number = 20) {
  return makeRequest(`/${PREFIX_ROUTE}/get-allairing`, {
    page,
    limit
  });
}

export function getBroadcastById(broadcastId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/detail/${broadcastId}`);
}

export function InteractBroadcast(broadcastId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/interact/${broadcastId}`, null, {
    method: 'POST'
  });
}

export function CreateBroadcast(broadcastForm: Broadcast) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: broadcastForm
  });
}

export function UpdateBroadcast(broadcastForm: Broadcast) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${broadcastForm.id}`, null, {
    method: 'POST',
    data: broadcastForm
  });
}

export function DeleteBroadcast(broadcastId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${broadcastId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleBroadcast(listBroadcastId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listBroadcastId }
  });
}
