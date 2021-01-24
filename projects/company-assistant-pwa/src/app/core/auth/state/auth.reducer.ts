import { createReducer, on, Action } from '@ngrx/store';
import { AuthState } from './auth.models';
import * as AuthActions from './auth.actions';

const initialState: AuthState = {
  isAuthenticated: false
};

const reducer = createReducer<AuthState>(
  initialState,
  on(
    AuthActions.authLogin,
    (state): AuthState => {
      return {
        ...state,
        isAuthenticated: true
      };
    }
  ),
  on(
    AuthActions.authLogout,
    (state): AuthState => {
      return {
        ...state,
        isAuthenticated: false
      };
    }
  )
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
