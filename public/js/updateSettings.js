import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  const url =
    `${type}` === 'password'
      ? 'http://localhost:3000/api/v1/users/updatePassword'
      : 'http://localhost:3000/api/v1/users/updateMe';

  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
