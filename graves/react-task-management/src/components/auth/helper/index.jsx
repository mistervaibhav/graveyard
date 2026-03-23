import axios from 'axios';
import { API } from '../../../backend';

/*----------------------------------------------------------------------------------------------- */

export const register = async (data) => {
  try {
    console.log(`outgoing data ==> ${JSON.stringify(data)}`);
    const response = await axios.post(`http://127.0.0.1:8000/register/`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(`incoming error ==> ${error}`);
    return error.response.data;
  }
};

/*----------------------------------------------------------------------------------------------- */

export const login = async (data) => {
  try {
    const response = await axios.post(`${API}/api-token-auth/`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

/*----------------------------------------------------------------------------------------------- */

export const logout = async (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    next();
  }
};

/*----------------------------------------------------------------------------------------------- */

export const authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', JSON.stringify(data));
    next();
  }
};

/*----------------------------------------------------------------------------------------------- */

export const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false;
  }

  if (localStorage.getItem('token')) {
    return JSON.parse(localStorage.getItem('token'));
  } else {
    return false;
  }
};

/*----------------------------------------------------------------------------------------------- */
