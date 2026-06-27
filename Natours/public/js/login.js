import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  const url = 'http://localhost:3000/api/v1/users/login';

  try {
    const res = await axios.post(url, {
      email,
      password,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
    }
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (error) {
    // console.error('error', error);
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const url = 'http://localhost:3000/api/v1/users/logout';

    const res = await axios(url);
    if ((res.data.status = 'success')) location.reload(true);
  } catch (error) {
    showAlert('error', 'Error logging out! Try again');
  }
};
