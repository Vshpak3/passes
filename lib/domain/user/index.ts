import { GetServerSidePropsContext } from 'next';

export interface User {
  id: string;
  name: string;
  rocket: string | null;
  timestamp: Date;
  twitter: string | null;
}

export interface IAuthInfo {
  token: string;
}

export interface IAuthSingIn {
  email: string;
  password: string;
}

export interface IAuthRegister {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthService {
  /**
   * Login user by email and password
   *
   * @param {IAuthSingIn} info
   * @returns {Promise<IAuthInfo>}
   * @memberof AuthService
   */
  login: (info: IAuthSingIn) => Promise<IAuthInfo>;

  /**
   * Save token
   *
   * @memberof IAuthService
   */
  saveToken: (token: string) => void;

  /**
   * Get saved token
   *
   * @memberof IAuthService
   */
  getToken: () => string | undefined;

  /**
   * Remove saved token
   *
   * @memberof IAuthService
   */
  removeToken: () => void;

  /**
   * subscribe to token change
   *
   * @memberof IAuthService
   */
  subscribeToken: (cb: (value: any) => any) => void;

  /**
   * unsubscribe to token change
   *
   * @memberof IAuthService
   */
  unsubscribeToken: (cb: (value: any) => any) => void;

  /**
   * Check auth token validity
   *
   * @memberof IAuthService
   */
  checkAuthTokenValid: (token: string) => Promise<boolean>;

  /**
   * Authenticate token from ssr request
   *
   * @memberof IAuthService
   */
  authenticateTokenSsr: (
    ctx: GetServerSidePropsContext
  ) => Promise<string | undefined>;
}
