import * as qs from 'qs';
import { baseURL } from 'src/constants/apiBaseUrl';

export const ApiConfig = {
    baseURL: baseURL,
    headers:{
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 10 * 1000,
    paramsSerializer: (params) => qs.stringify(params, { indices: false }),
    withCredentials:false
};