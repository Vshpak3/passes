/* eslint no-underscore-dangle: "error" */
import axios, { AxiosRequestConfig } from 'axios';
import API_CONFIG from '@constants/API_CONFIG';
import { TypedEvent } from '@helpers/event';

import {
  // AuthRequest,
  // NonAuthRequest,
  // RequestParams,
  HTTPRequest,
  RequestParams,
  // AuthRequestParams,
} from './types';
import { serviceErrorHandler } from './error';
import { HTTPStatusCode, UnauthorizedEvent } from './helpers';

export interface HTTPService {
  post: HTTPRequest;
  get: HTTPRequest;
  del: HTTPRequest;
  put: HTTPRequest;
  patch: HTTPRequest;
  authGet: HTTPRequest;
  authPost: HTTPRequest;
  authDel: HTTPRequest;
  authPut: HTTPRequest;
  authPatch: HTTPRequest;
  isFailureResponse: (arg: Error) => arg is Error;
  unauthorizedEvent: UnauthorizedEvent;
}

/**
 * add user token to request header
 *
 * @param {Options} options - url Endpoint
 * @param token
 * @returns {Options}
 */
export const withUserToken = (
  options: AxiosRequestConfig,
  token?: string
): AxiosRequestConfig => {
  if (!token) {
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      authorization: `Bearer ${token}`,
    },
  };
};

// HTTP service factory
const httpService = (): HTTPService => {
  const instance = axios.create({
    baseURL: API_CONFIG.HOST,
    timeout: API_CONFIG.timeout,
  });
  const unauthorizedEvent = new TypedEvent<HTTPStatusCode.UNAUTHORIZED>();

  const post: HTTPRequest = serviceErrorHandler(
    async ({ url, data, options }: RequestParams) => {
      // const reqOptions = hmacRequest(options, data);
      const res = await instance.post(url, data, options);

      return res;
    },
    unauthorizedEvent
  );

  const get: HTTPRequest = serviceErrorHandler(
    async ({ url, data, options }: RequestParams) => {
      // let reqOptions = hmacRequest(options);
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      let reqOptions = options;
      if (data) {
        reqOptions = {
          ...options,

          params: data,
        };
      }

      const res = await instance.get(url, reqOptions);

      return res;
    },
    unauthorizedEvent
  );

  const del: HTTPRequest = serviceErrorHandler(
    async ({ url, options }: RequestParams) => {
      // const reqOptions = hmacRequest(options);
      const res = await instance.delete(url, options);

      return res;
    },
    unauthorizedEvent
  );

  const put: HTTPRequest = serviceErrorHandler(
    async ({ url, data, options }: RequestParams) => {
      // const reqOptions = hmacRequest(options);
      const res = await instance.put(url, data, options);

      return res;
    },
    unauthorizedEvent
  );
  const patch: HTTPRequest = serviceErrorHandler(
    async ({ url, data, options }) => {
      const res = await instance.patch(url, data, options);

      return res;
    },
    unauthorizedEvent
  );

  const authGet: HTTPRequest = serviceErrorHandler(
    ({ url, token, data, options = {} }: RequestParams) =>
      get({ url, data, options: withUserToken(options, token) }),
    unauthorizedEvent
  );

  const authPost: HTTPRequest = serviceErrorHandler(
    ({ url, token, data, options = {} }: RequestParams) =>
      post({ url, data, options: withUserToken(options, token) }),
    unauthorizedEvent
  );

  const authDel: HTTPRequest = serviceErrorHandler(
    ({ url, token, options = {} }: RequestParams) =>
      del({ url, options: withUserToken(options, token) }),
    unauthorizedEvent
  );

  const authPut: HTTPRequest = serviceErrorHandler(
    ({ url, token, data, options = {} }: RequestParams) =>
      put({ url, data, options: withUserToken(options, token) }),
    unauthorizedEvent
  );
  const authPatch: HTTPRequest = serviceErrorHandler(
    ({ url, token, data, options = {} }) =>
      patch({ url, data, options: withUserToken(options, token) }),
    unauthorizedEvent
  );

  /**
   * API Failure Response type guard
   *
   * @param {*} arg any
   * @returns {arg is Error}
   */
  const isFailureResponse = (arg: Error): arg is Error => {
    return arg.message !== undefined;
  };

  return {
    post,
    get,
    del,
    put,
    patch,
    authGet,
    authPost,
    authDel,
    authPut,
    authPatch,
    isFailureResponse,
    unauthorizedEvent,
  };
};

export default httpService;
