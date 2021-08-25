import { AppThunk } from '../types';
import { IAuthSingIn } from '@domain/user';
import { AuthActions } from '@state/_actions';

export const userLogin: (info: IAuthSingIn) => AppThunk<Promise<void>> =
  (info) =>
  async (dispatch, _getState, container): Promise<void> => {
    const res = await container.cradle.authService.login(info);
    // save token
    container.cradle.authService.saveToken(res.token);
    dispatch(AuthActions.setAuthToken(res.token));
  };

export default {
  userLogin,
};
