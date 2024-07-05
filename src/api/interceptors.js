import axios from 'axios';
import Axios from 'axios'
import { RawAxiosInstance } from "./index";
import { HTTP_STATUS_CODES } from 'src/constants/HttpStatusCodes';
import { getAuthorization } from 'src/utils/getAuthorization';
import { useUser } from 'src/contexts/GlobalContext';
import { baseURL } from 'src/constants/apiBaseUrl';

export const responseInterceptors = {
  successInterceptor(response) {
    return response;
  },
  async errorInterceptor(error) {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const statusCode = error?.response?.status;

    if (statusCode) {
      switch (statusCode) {
        case HTTP_STATUS_CODES.CACHED_RESPONSE:
          return Promise.resolve(error.response.data);
        case HTTP_STATUS_CODES.VALIDATION_ERROR:
          console.error(error.response?.data?.meta?.message);
          break;
        case HTTP_STATUS_CODES.SERVER_ERROR:
          console.error(error.response?.data?.meta?.message);
          break;
        case HTTP_STATUS_CODES.NOT_FOUND:
          console.error(error.response?.data?.meta?.message);
          break;
        case HTTP_STATUS_CODES.UN_AUTHORIZED:
          return handleRefreshToken(error)
        case HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY:
          console.error(error.response?.data?.meta?.message);
          break;
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
};

export const requestInterceptors = {
  beforeSent(config) {
    const authorization = getAuthorization();

    if (authorization) {



      let branch = localStorage.getItem('branchId')


      config.headers = {
        ...config.headers,
        Authorization: authorization,
        'branch-id': branch
      };
      return config
    } else return config
  },
  onError(error) {
    return Promise.reject(error);
  },
};

const handleRefreshToken = async (error) => {
  const originalConfig = error.config
  const authorization = await getAuthorization('refresh');
  const { localStorage, location } = window
  
  
  // ****** refresh token on 401 error commented out for now as refresh makes new token not appropriate for admin and APIs get 401 after that for unknow reason.  
  try {
    await Axios.get(baseURL+'/v1/users/refreshToken', { headers: { 'Authorization': authorization } }).then(async(res) => {
      if(res.data.data) {
        const { accessToken, refreshToken, admin, menu } = res.data.data
        await localStorage.setItem('user', JSON.stringify(admin))
        await localStorage.setItem('token', accessToken);
        await localStorage.setItem('refresh_token', refreshToken);
        originalConfig.headers['Authorization'] = 'Bearer ' + accessToken;
        return Axios.request(originalConfig);
      }
      
    })
    
  } catch (error) {
    console.warn('error in refreshing token', error);
    await localStorage.removeItem('user')
    await localStorage.removeItem('token');
    await localStorage.removeItem('refresh_token');
    await localStorage.removeItem('perms');
    await localStorage.removeItem('branchId');
    location.reload();
    Promise.reject(error);
  }
}
