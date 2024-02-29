import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL_PREDICTION } from './config';
export const API_URL = API_URL_PREDICTION;
export const AXIOS_TIMEOUT = 1000 * 60;

export class SetupAxios {
  public instance: AxiosInstance;

  private onResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: AXIOS_TIMEOUT,
    });

    this.instance.interceptors.response.use(this.onResponse);
  }

  private async _getConfig(config: AxiosRequestConfig = {}) {
    const configAPI =
      config && config.headers
        ? {
            ...config.headers,
          }
        : {
            headers: {
              accept: '/',
            },
          };
    return configAPI;
  }

  public get = async (url = '', config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    const configAPI = await this._getConfig(config);

    return this.instance
      .get(url, {
        ...config,
        ...configAPI,
      })
      .then((response) => response);
  };

  public post = async (url = '', body = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    const configAPI = await this._getConfig(config);

    return this.instance
      .post(url, body, {
        ...config,
        ...configAPI,
      })
      .then((response) => response);
  };

  public patch = async (url = '', body = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    const configAPI = await this._getConfig(config);

    return this.instance
      .patch(url, body, {
        ...config,
        ...configAPI,
      })
      .then((response) => response);
  };

  public put = async (url = '', body = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    const configAPI = await this._getConfig(config);

    return this.instance
      .put(url, body, {
        ...config,
        ...configAPI,
      })
      .then((response) => response);
  };

  public delete = async (url = '', config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
    const configAPI = await this._getConfig(config);

    return this.instance
      .delete(url, {
        ...config,
        ...configAPI,
      })
      .then((response) => response);
  };
}

export const axiosInstance = new SetupAxios();
