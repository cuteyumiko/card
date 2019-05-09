import axios from 'axios';

const loginForm = {
  login() {
    return async dispatch => {
      dispatch({ type: 'LOGIN_FETCHING ' });

      const result = await axios.post('/api/authorize', {});

    }
  }
}
