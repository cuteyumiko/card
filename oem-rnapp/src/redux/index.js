import { combineReducers } from 'redux';
import app from './app';
import loginForm from './loginForm';
//
// export default {
//   actions: loginForm.actions,
//   reducers: loginForm.reducers,
// }

export const actions = {
  app: app.actions,
  loginForm: loginForm.actions,
}

export const reducers = combineReducers({
  app: app.reducers,
  loginForm: loginForm.reducers
})
