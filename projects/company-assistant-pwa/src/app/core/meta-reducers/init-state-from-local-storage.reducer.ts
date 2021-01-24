import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { AppState } from '../../state/app.state';

export function initStateFromLocalStorage(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function (state, action) {
    const newState = reducer(state, action);
    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      const state = { ...newState, ...LocalStorageService.loadInitialState() };
      return state;
    }
    return newState;
  };
}
