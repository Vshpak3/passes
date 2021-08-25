import { IAuthSingIn, IAuthInfo, IAuthService } from '@domain/user';
import Cookies from 'universal-cookie';
import { GetServerSidePropsContext } from 'next';
import { HTTPService } from '@infra/HTTPService/HTTPService';
import { HTTPStatusCode } from '@infra/HTTPService/helpers';
import jwtDecode from 'jwt-decode';
import { TypedEvent } from '@helpers/event';

export interface DecodedToken {
  readonly email: string;
  readonly exp: number;
}

const TOKEN_COOKIE_KEY = 'token';

interface Dependencies {
  httpService: HTTPService;
}

type TokenListener = (value?: string) => void;
export class AuthService implements IAuthService {
  private httpService: HTTPService;

  private onTokenChange = new TypedEvent<string | undefined>();

  private cookies = new Cookies();

  private token = 'fake-super-toke';

  constructor({ httpService }: Dependencies) {
    this.httpService = httpService;
  }

  async login(info: IAuthSingIn): Promise<IAuthInfo> {
    // const url = `users/login`;
    console.log(info);
    // call login POST api
    // const { data }: { data: User } = await this.httpService.post({
    //   url,
    //   data: info,
    // });
    // const res = await this.httpService.authGet({
    //   url: 'users/me',
    //   token: data.email,
    // });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: this.token });
      }, 3000);
    });
  }

  saveToken = (token: string): void => {
    // save token to browser cookies
    const date = new Date();
    date.setDate(date.getDate() + 365);
    this.cookies.set(TOKEN_COOKIE_KEY, token, {
      path: '/',
      expires: date,
    });

    // token listener cb execute
    this.onTokenChange.emit(token);
  };

  getToken = (): string | undefined => {
    // get token from browser cookies
    const token = this.cookies.get<string>(TOKEN_COOKIE_KEY);

    return token;
  };

  subscribeToken = (cb: TokenListener): void => {
    this.onTokenChange.on(cb);
  };

  unsubscribeToken = (cb: TokenListener): void => {
    this.onTokenChange.off(cb);
  };

  removeToken = (): void => {
    // get token from browser cookies
    this.cookies.remove(TOKEN_COOKIE_KEY, { path: '/' });

    // token listener cb execute
    this.onTokenChange.emit(undefined);
  };

  checkAuthTokenValid = async (token: string): Promise<boolean> => {
    // false if no token
    if (!token) return Promise.resolve(false);

    // decode jwt token
    const decodedToken: DecodedToken = jwtDecode(token);
    // check if token expired
    const expiresAt = new Date(decodedToken.exp * 1000);
    const isExpired = new Date() > expiresAt;

    // token valid if not expired
    const isAuthenticated = !isExpired;
    // TODO: might need to call auth validate api to validate token ( e.g '/auth/validate' or '/user/me' )

    if (!isAuthenticated) {
      // emit unauthorized event
      this.httpService.unauthorizedEvent.emit(HTTPStatusCode.UNAUTHORIZED);
    }

    return Promise.resolve(isAuthenticated);
  };

  authenticateTokenSsr = async (
    ctx: GetServerSidePropsContext
  ): Promise<string | undefined> => {
    // get cookies from request header
    // create new Cookies instance to get cookie from request headers
    const cookies = new Cookies(ctx.req ? ctx.req.headers.cookie : null);
    const token = cookies.get(TOKEN_COOKIE_KEY);

    // check token validity
    const isValid = await this.checkAuthTokenValid(token);

    // return nothing if not valid
    if (!isValid) return Promise.resolve(undefined);

    // save token from request header for later use
    this.saveToken(token);

    return Promise.resolve(token);
  };
}
