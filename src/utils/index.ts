import {
  SPACES_REGEX,
  toPath,
  toPathInfo_Play,
  parsePathInfo_Play
} from './convertPath';
import { viewFormatter } from './convertViews';
import { customCookie } from './customCookie';
import { customLocalStorage } from './customLocalStorage';
import { dateTimeFormater } from './dateTimeFormater';
import { encryptPassword } from './encryptPassword';
import {
  handleAddItemToList,
  handleRemoveAllitemFromHistory,
  handleRemoveAllitemFromList,
  handleRemoveItemFromHistory,
  handleRemoveItemFromList
} from './handleAddRemoveItemList_History';
import { initFacebookSdk } from './initFacebookSDK';
import { conrfirmMessageModal } from './messageModal';
import { removeVietnameseTones } from './removeVietnameseTones';
import { wait } from './wait';

export const useUtils = () => {
  return {
    SPACES_REGEX,
    EMAIL_REGEX,
    CHARACTERS_REGEX,
    convertPath: { toPath, toPathInfo_Play, parsePathInfo_Play },
    isNull,
    isString,
    isNumber,
    isStringNumber,
    isStringEmpty,
    isArrayEmpty,
    isEmailValid,
    isSpecialCharacters,
    isVietnameseTones,
    isWindowScrollBottom,
    isElementScrollBottom,
    minmax,
    serialize,
    handleAddItemToList,
    viewFormatter,
    encryptPassword,
    handleRemoveItemFromList,
    handleRemoveAllitemFromList,
    handleRemoveItemFromHistory,
    handleRemoveAllitemFromHistory,
    initFacebookSdk,
    cookie: customCookie(),
    localStorage: customLocalStorage(),
    dateTimeFormater: dateTimeFormater(),
    conrfirmMessageModal,
    removeVietnameseTones,
    wait
  };
};

export const NUMBER_REGEX = /^\d+$/g;
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/im;
export const CHARACTERS_REGEX = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/gim;
export const VIETNAMESE_REGEX =
  /Â|Ã|È|É|Ê|Ì|Í|Ò|Ó|Ô|Õ|Ù|Ú|Ă|Đ|Ĩ|Ũ|Ơ|à|á|â|ã|è|é|ê|ì|í|ò|ó|ô|õ|ù|ú|ă|đ|ĩ|ũ|ơ|Ư|Ă|Ạ|Ả|Ấ|Ầ|Ẩ|Ẫ|Ậ|Ắ|Ằ|Ẳ|Ẵ|Ặ|Ẹ|Ẻ|Ẽ|Ề|Ề|Ể|Ế|ư|ă|ạ|ả|ấ|ầ|ẩ|ẫ|ậ|ắ|ằ|ẳ|ẵ|ặ|ẹ|ẻ|ẽ|ề|ề|ể|ế|Ễ|Ệ|Ỉ|Ị|Ọ|Ỏ|Ố|Ồ|Ổ|Ỗ|Ộ|Ớ|Ờ|Ở|Ỡ|Ợ|Ụ|Ủ|Ứ|Ừ|ễ|ệ|ỉ|ị|ọ|ỏ|ố|ồ|ổ|ỗ|ộ|ớ|ờ|ở|ỡ|ợ|ụ|ủ|ứ|ừ|Ử|Ữ|Ự|Ỳ|Ỵ|Ý|Ỷ|Ỹ|ử|ữ|ự|ỳ|ỵ|ỷ|ỹ/gim;

export function isNull(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isString(obj: any): boolean {
  return typeof obj === 'string' || obj instanceof String;
}

export function isNumber(obj: any): boolean {
  return typeof obj === 'number' || obj instanceof Number;
}

export function isStringNumber(obj: any): boolean {
  return isString(obj) && NUMBER_REGEX.test(obj);
}

export function isStringEmpty(str: string | null | undefined): boolean {
  return isNull(str) || str === '';
}

export function isArrayEmpty(obj: any[]): boolean {
  return isNull(obj) || obj.length === 0;
}

export function isEmailValid(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isSpecialCharacters(str: string): boolean {
  return CHARACTERS_REGEX.test(str);
}

export function isVietnameseTones(str: string): boolean {
  return VIETNAMESE_REGEX.test(str);
}

export function isWindowScrollBottom(options?: { offset?: number }): boolean {
  if (!import.meta.env.SSR) {
    const scrollHeight = Math.round(window.scrollY + window.innerHeight);

    return scrollHeight == document.documentElement.scrollHeight;
  } else {
    return false;
  }
}

export function isElementScrollBottom(
  element: HTMLElement,
  options?: { offset?: number }
): boolean {
  if (!import.meta.env.SSR) {
    const scrollHeight = Math.ceil(element.scrollTop + element.clientHeight);

    return scrollHeight >= element.scrollHeight;
  } else {
    return false;
  }
}

export function minmax(
  val: number,
  { min, max }: { min?: number; max?: number }
) {
  if (min !== undefined && max !== undefined && min > max) {
    throw new Error('min should be smaller than max');
  }
  let result = val;
  if (min !== undefined) {
    result = Math.max(result, min);
  }

  if (max !== undefined) {
    result = Math.min(result, max);
  }

  return result;
}

export function serialize(obj: object | any): string | null {
  if (!obj) return null;
  // var str = [];
  // for (var p in obj)
  //   if (obj.hasOwnProperty(p)) {
  //     str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
  //   }
  // return str.join('&');

  return new URLSearchParams(obj).toString();
}

export const getGreet = () => {
  const now = new Date();
  const hour = now.getHours();
  let greet = '';

  if (hour < 5) {
    greet = 'Đã khuya, hãy chú ý đến cơ thể của bạn!';
  } else if (hour < 9) {
    greet = 'Chào buổi sáng.' + ' Chào mừng trở lại!';
  } else if (hour < 12) {
    greet = 'Chào buổi sáng.' + ' Chào mừng trở lại!';
  } else if (hour < 14) {
    greet = 'Chào buổi trưa.' + ' Chào mừng trở lại!';
  } else if (hour < 18) {
    greet = 'Chào buổi chiều.' + ' Chào mừng trở lại!';
  } else if (hour < 24) {
    greet = 'Chào buổi tối.' + ' Chào mừng trở lại!';
  } else {
    greet = 'Xin chào.' + ' Chào mừng trở lại!';
  }
  return greet;
};

export * from './convertPath';
export * from './convertViews';
export * from './customCookie';
export * from './customLocalStorage';
export * from './dateTimeFormater';
export * from './encryptPassword';
export * from './facebookService';
export * from './handleAddRemoveItemList_History';
export * from './initFacebookSDK';
export * from './messageModal';
export * from './removeVietnameseTones';
export * from './wait';
