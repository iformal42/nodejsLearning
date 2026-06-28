import axios from 'axios';
import { showAlert } from './alert';
import { BASEURL } from '../../utils/constanst';
const url = `${BASEURL}/users`;
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${url}/login`, {
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
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios(`${url}/logout`);
    if ((res.data.status = 'success')) location.reload(true);
  } catch (error) {
    showAlert('error', 'Error logging out! Try again');
  }
};
