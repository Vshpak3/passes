import { createReducer, getType } from 'typesafe-actions';
import { AuthActions } from '@state/_actions';
import { AuthState } from './types';

const AUTH_NAMESPACE = 'auth';

/* ------------- Initial State ------------- */
const INITIAL_STATE = {
  token: null,
};

/* ------------- Reducers ------------- */
const setAuthToken = (
  state: AuthState,
  { payload: { token } }: ReturnType<typeof AuthActions.setAuthToken>
): AuthState => {
  return Object.assign(state, { token });
};

/* ------------- Hookup Reducers To Types ------------- */
const reducer = createReducer(INITIAL_STATE, {
  [getType(AuthActions.setAuthToken)]: setAuthToken,
});

export default { [AUTH_NAMESPACE]: reducer };
