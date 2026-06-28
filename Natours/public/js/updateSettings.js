import axios from 'axios';
import { BASEURL } from '../../utils/constanst';
import { showAlert } from './alert';

const url = `${BASEURL}/users`;

export const updateDataSettings = async (body, type) => {
  try {
    const endPoint = type === 'password' ? 'update-password' : 'update-me';
    const responce = await axios.patch(`${url}/${endPoint}`, body);

    if (responce.data.status === 'success')
      showAlert('success', `${type.toLocaleUpperCase()} updated successfully`);
  } catch (error) {
    console.error(error?.responce || error);
    const message =
      error?.response?.data?.message ||
      'Something went wrong please try again later';
    showAlert('error', message);
  }
};
