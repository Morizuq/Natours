import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  console.log(tourId);
  try {
    await axios(
      `/api/v1/bookings/pay/${tourId}`
    );
  } catch (error) {
    showAlert('error', 'Something went wrong, please try again!');
  }
};
