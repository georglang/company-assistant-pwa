import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';
import { AuthState } from '../core/auth/state/auth.models';
import { authReducer } from '../core/auth/state/auth.reducer';
import { initStateFromLocalStorage } from '../core/meta-reducers/init-state-from-local-storage.reducer';

export interface AppState {
  auth: AuthState;
}
export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer
};

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];
