import type { user } from '@/types';
import { makeRequest } from './makeRequest';
import dayjs from 'dayjs';
import axios from 'axios';

const PREFIX_ROUTE = 'account';

export function getAllAccount(page: number = 1, limit: number = 20) {
  return makeRequest(`/${PREFIX_ROUTE}/get-all`, {
    page,
    limit
  });
}

export function SearchAccount(
  query: string,
  page: number = 1,
  limit: number = 20
) {
  return makeRequest(`/${PREFIX_ROUTE}/search`, {
    query,
    page,
    limit
  });
}

export function GetStatisticsUsers(
  startOfDay: string = dayjs().format('YYYY-MM-DD'),
  endOfDay: string = dayjs().format('YYYY-MM-DD')
) {
  return makeRequest(`/${PREFIX_ROUTE}/get-statistics`, {
    startOfDay,
    endOfDay
  });
}

export function getTrafficDataCloudflare() {
  const ZONE_ID = 'cd6053fef7ddad92250a7e945cf89765';
  const API_TOKEN = '_eZImi8Mhn2hMK3wOz-2UpR22y0IQA146fXX__lg';

  const apiUrl = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/analytics/dashboard`;

  return axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}

export function AccountConfirm(
  params: {
    oldPassword?: string;
    newPassword?: string;
    logOutAllDevice?: boolean;
    email?: string;
    newEmail?: string;
  },
  type: string
) {
  const bodyFormData = new FormData();

  switch (type) {
    case 'change-password':
      bodyFormData.append('old_password', params.oldPassword!);
      bodyFormData.append('new_password', params.newPassword!);
      bodyFormData.append('logout_all_device', `${params.logOutAllDevice!}`);
      break;
    case 'email':
      bodyFormData.append('email', params.email!);
      break;
    case 'change-email':
      bodyFormData.append('new_email', params.newEmail!);
      break;
  }

  return makeRequest(`/${PREFIX_ROUTE}/confirm/${type}`, null, {
    method: 'POST',
    data: bodyFormData,
    getResponseHeaders: true
  });
}

export function ChangePassword(params: { otp: string; chgPwdToken: string }) {
  const bodyFormData = new FormData();
  bodyFormData.append('otp', params.otp);

  return makeRequest(`/${PREFIX_ROUTE}/change-password`, null, {
    method: 'POST',
    data: bodyFormData,
    getResponseHeaders: true
  });
}

export function VerifyEmail(params: { otp: string; vrfEmailToken: string }) {
  const bodyFormData = new FormData();
  bodyFormData.append('otp', params.otp);

  return makeRequest(`/${PREFIX_ROUTE}/verify-email`, null, {
    method: 'POST',
    data: bodyFormData
  });
}

export function VerifyChangeEmail(chgEmailToken: string) {
  return makeRequest(`/${PREFIX_ROUTE}/change-email`, {
    token: chgEmailToken
  });
}

export function ChangeEmail(params: {
  chgEmailToken: string;
  newEmail: string;
}) {
  const bodyFormData = new FormData();
  bodyFormData.append('new_email', params.newEmail);

  return makeRequest(`/${PREFIX_ROUTE}/change-email`, null, {
    method: 'POST',
    data: bodyFormData,
    getResponseHeaders: true
  });
}

export function ChangeFullname(newfullName: string) {
  const bodyFormData = new FormData();
  bodyFormData.append('new_full_name', newfullName);

  return makeRequest(`/${PREFIX_ROUTE}/change-fullname`, null, {
    method: 'POST',
    data: bodyFormData,
    getResponseHeaders: true
  });
}

export function VerifyResetPassword(rstPwdToken: string) {
  return makeRequest(`/${PREFIX_ROUTE}/reset-password`, {
    token: rstPwdToken
  });
}

export function ResetPassword(params: {
  rstPwdToken: string;
  newPassword: string;
  logOutAllDevice: boolean;
}) {
  const bodyFormData = new FormData();
  bodyFormData.append('new_password', params.newPassword);
  bodyFormData.append('logout_all_device', `${params.logOutAllDevice}`);

  return makeRequest(`/${PREFIX_ROUTE}/reset-password`, null, {
    method: 'POST',
    data: bodyFormData,
    getResponseHeaders: true
  });
}

export function CreateAccount(accountForm: user) {
  return makeRequest(`/${PREFIX_ROUTE}/create`, null, {
    method: 'POST',
    data: accountForm
  });
}

export function UpdateAccount(accountForm: user) {
  return makeRequest(`/${PREFIX_ROUTE}/update/${accountForm.id}`, null, {
    method: 'POST',
    data: accountForm
  });
}

export function DeleteAccount(accountId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete/${accountId}`, null, {
    method: 'DELETE'
  });
}

export function DeletePermanentAccount(accountId: number | string) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-permanent/${accountId}`, null, {
    method: 'DELETE'
  });
}

export function DeleteMultipleAccount(listAccountId: string[] | number[]) {
  return makeRequest(`/${PREFIX_ROUTE}/delete-multiple`, null, {
    method: 'DELETE',
    data: { listAccountId }
  });
}
