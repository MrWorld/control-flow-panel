import Axios from 'axios';

import { ApiConfig } from './config';
import { requestInterceptors, responseInterceptors } from './interceptors';

const APIInstance = () => {
  const instance = Axios.create(ApiConfig);

  instance.interceptors.response.use(responseInterceptors.successInterceptor, responseInterceptors.errorInterceptor)

  instance.interceptors.request.use(requestInterceptors.beforeSent, requestInterceptors.onError)

  return {
    get: (
      url,
      config,
      cache = false,
    ) => {
      return instance.get(url, {
        ...config,
        customCache: cache,
      });
    },

    post:(url, data, config) => {
      return instance.post(url, data, config);
    },

    put: (url, data, config) => {
      return instance.put(url, data, config);
    },

    patch:(url, data, config) => {
      return instance.patch(url, data, config);
    },

    delete:(url, config) => {
      return instance.delete(url, config);
    },

    deleteByBody: (url, data, config) => {
      return instance.delete(url,{
        data,
        ...config
      });
    },

    // Result managers
    GetSuccessData:(response) => {
      return response.data;
    },

    GetFailureData: (error) => {
      console.log('>>> 111 ERROR:', { error, errorEesponse: error.response?.data });
      return {
        errorCode: error.response?.data?.status || '',
        errorMessage: error.response?.data?.message || '',
        errorResponse: error.response?.data || '',
      };
    },
  };
};

export const AxiosInstance = APIInstance();
export const RawAxiosInstance = Axios.create(ApiConfig);