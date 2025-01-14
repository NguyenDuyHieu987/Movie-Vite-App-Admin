import type {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  ParamsSerializerOptions,
  AxiosProgressEvent
} from 'axios';
import axios from 'axios';

type MakeRequestOptions = {
  noAuthHeaders?: boolean;
  getResponseHeaders?: boolean;
} & AxiosRequestConfig;

export function makeRequest(
  url: string,
  params?: any,
  options: MakeRequestOptions = {
    noAuthHeaders: false,
    getResponseHeaders: false
  }
) {
  const headers: AxiosRequestHeaders | any = {};

  const api = axios.create({
    baseURL: import.meta.env.PROD
      ? import.meta.env.VITE_API_GATEWAY
      : import.meta.env.VITE_API_GATEWAY_DEV,
    // 'http://127.0.0.1:5000',
    withCredentials: true
  });

  // const utils = useUtils();
  // const userToken = utils.localStorage.getWithExpiry(TOKEN.NAME.USER_TOKEN);

  // if (userToken && !options?.noAuthHeaders) {
  //   if (!options.headers?.Authorization) {
  //     headers.Authorization = `Bearer ${userToken}`;
  //   }
  // }

  return api(url, {
    // proxy: {
    //   protocol: 'http',
    //   host: 'localhost',
    //   port: 5000
    // },
    params: params,
    ...options,
    headers: { ...headers, ...options?.headers }
  })
    .then((res: AxiosResponse) => {
      const { headers, data } = res;

      if (options?.getResponseHeaders) {
        return { headers, ...data };
      }

      return data;
    })
    .catch((error) =>
      Promise.reject(error?.response?.data?.message ?? 'Error')
    );
}

export async function makeMediaRequest(
  url: string,
  params?: any,
  options: MakeRequestOptions = {
    noAuthHeaders: false,
    getResponseHeaders: false
  },
  onUploadProgress?: (e: AxiosProgressEvent) => void,
  onDownloadProgress?: (e: AxiosProgressEvent) => void
) {
  const headers: AxiosRequestHeaders | any = {};

  const api = axios.create({
    baseURL: import.meta.env.PROD
      ? import.meta.env.VITE_MEDIA_API_GATEWAY
      : import.meta.env.VITE_MEDIA_API_GATEWAY_DEV,
    withCredentials: true
  });

  return await api(url, {
    params: params,
    ...options,
    headers: { ...headers, ...options?.headers },
    onUploadProgress: onUploadProgress,
    onDownloadProgress: onDownloadProgress
  })
    .then((res) => {
      const { headers, data } = res;

      if (options?.getResponseHeaders) {
        return { headers, ...data };
      }

      return data;
    })
    .catch((error) =>
      Promise.reject(error?.response?.data?.message ?? 'Error')
    );
}
