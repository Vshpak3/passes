import { asClass, asFunction, createContainer } from 'awilix';

import { IAuthService } from '@domain/user';
import { AuthService } from '@infra/auth/AuthService';

import makeHTTPService, { HTTPService } from '@infra/HTTPService/HTTPService';
import makeLogOutUseCase, { LogOutUseCase } from '@app/auth/logOutUseCase';

export interface Cradle {
  // services
  httpService: HTTPService;
  authService: IAuthService;
  // apps
  logOutUseCase: LogOutUseCase;
}

// Create the container and set the injectionMode to PROXY (which is also the default).
const container = createContainer<Cradle>();

/* ------------- Infra ------------- */
container
  // services
  .register({
    httpService: asFunction(makeHTTPService).singleton(),
    authService: asClass(AuthService).singleton(),
  });
// repositories

/* ------------- App ------------- */
container
  // commit
  .register({
    logOutUseCase: asFunction(makeLogOutUseCase),
  });

export default container;
