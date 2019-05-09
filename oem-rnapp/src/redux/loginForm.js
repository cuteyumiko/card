import { createActions, handleActions, combineActions } from 'redux-actions';
import axios from 'axios';


const actions = createActions({
  LOGIN: (mobile, password) => ({ mobile, password, pending: true }),
  LOGIN_SUCCESS: (token, user) => ({ token, user, pending: false }),
  LOGIN_FAILURE: (errmsg) => ({ errmsg, pending: false })
})

const { login, loginSuccess, loginFailure } = actions;

const reducers = handleActions({
  [combineActions(login, loginSuccess, loginFailure)]: (state, { payload }) => ({ ...state, ...payload }),
}, {
  loading: '123145',
})

export default {
  actions: {
    ...actions,
    login: (mobile, password) => async dispatch => {
      dispatch(login(mobile, password))
      try {
        const { data } = await axios.post('/api/authorize', { mobile, password })
        dispatch(loginSuccess(data.token));
      } catch(e) {
        const message = e.message;
        dispatch(loginFailure(message));
      }
    }
  },
  reducers,
}
