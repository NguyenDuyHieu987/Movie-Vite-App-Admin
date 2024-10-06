import { makeRequest } from './makeRequest';

const PREFIX_ROUTE = 'notification';

export function getNotifications() {
  return makeRequest(`/${PREFIX_ROUTE}/get`);
}
