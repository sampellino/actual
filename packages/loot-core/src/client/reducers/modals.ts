import * as constants from '../constants';
import type { Action } from '../state-types';
import type { ModalsState } from '../state-types/modals';

export const initialState: ModalsState = {
  modalStack: [],
  isHidden: false,
};

export function update(state = initialState, action: Action): ModalsState {
  switch (action.type) {
    case constants.PUSH_MODAL:
      // special case: don't show the keyboard shortcuts modal if there's already a modal open
      if (
        action.modal.name.endsWith('keyboard-shortcuts') &&
        (state.modalStack.length > 0 ||
          window.document.querySelector(
            'div[data-testid="filters-menu-tooltip"]',
          ) !== null)
      ) {
        return state;
      }
      return {
        ...state,
        modalStack: [...state.modalStack, action.modal],
      };
    case constants.REPLACE_MODAL:
      return {
        ...state,
        modalStack: [action.modal],
      };
    case constants.POP_MODAL:
      return { ...state, modalStack: state.modalStack.slice(0, -1) };
    case constants.CLOSE_MODAL:
      return {
        ...state,
        modalStack: [],
      };
    case constants.COLLAPSE_MODALS:
      const idx = state.modalStack.findIndex(
        m => m.name === action.rootModalName,
      );
      return {
        ...state,
        modalStack: idx < 0 ? state.modalStack : state.modalStack.slice(0, idx),
      };
    case constants.SET_APP_STATE:
      if ('loadingText' in action.state) {
        return {
          ...state,
          isHidden: action.state.loadingText != null,
        };
      }
      break;
    case constants.SIGN_OUT:
      return initialState;
    default:
  }

  return state;
}
