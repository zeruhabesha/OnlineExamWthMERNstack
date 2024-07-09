// src/actions/authActions.js
import axios from 'axios';
import { loginSuccess, loginFail, logout } from '../reducers/authReducer';

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:7000/api/auth/login', { email, password });
    dispatch(loginSuccess(response.data));
    localStorage.setItem('token', response.data.token); // Save token to localStorage
  } catch (error) {
    dispatch(loginFail({ error: error.response.data }));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};
