import deepFreeze from 'deep-freeze-strict';
import { ACTION_TYPES } from './FormActionTypes';

const initialState = deepFreeze({});

function formReducer(state = initialState, action) {
  const updateForm = (formId, data) => Object.assign({},
    state, {
      [formId]: Object.assign({},
        state[formId],
        data
      ),
    });

  switch (action.type) {

    case ACTION_TYPES.SUBMIT_FORM_REQUEST:
      return deepFreeze(updateForm(action.payload.formId, {
        error: false,
        submitting: true,
      }));

    case ACTION_TYPES.REMOVE_FORM:
      return deepFreeze(Object.keys(state).reduce((previous, current) => {
        if (current === action.payload.formId) {
          return previous;
        }
        return Object.assign({}, previous, {
          [current]: state[current],
        });
      }, {}));

    case ACTION_TYPES.ADD_FORM:
      return deepFreeze(Object.assign({}, state, {
        [action.payload.formState.id]: {
          fields: action.payload.formState.fields,
          error: false,
          submitting: false,
        },
      }));

    case ACTION_TYPES.UPDATE_FIELD:
      return deepFreeze(updateForm(action.payload.formId, {
        fields: state[action.payload.formId].fields.map((field) => {
          if (field.id === action.payload.updates.id) {
            return Object.assign({}, field, action.payload.updates);
          }
          return field;
        }),
      }));

    case ACTION_TYPES.SUBMIT_FORM_SUCCESS:
      return deepFreeze(updateForm(action.payload.response.id, {
        fields: action.payload.response.state.fields,
        error: false,
        messages: action.payload.response.state.messages,
        submitting: false,
      }));

    case ACTION_TYPES.SUBMIT_FORM_FAILURE:
      return deepFreeze(updateForm(action.payload.formId, {
        error: true,
        messages: action.payload.error,
        submitting: false,
      }));

    case ACTION_TYPES.SET_SUBMIT_ACTION:
      return deepFreeze(updateForm(action.payload.formId, {
        submitAction: action.payload.submitAction,
      }));

    default:
      return state;

  }
}

export default formReducer;
