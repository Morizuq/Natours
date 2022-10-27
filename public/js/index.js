import '@babel/polyfill';

import { login, logout, signup } from './login';
import { updateSettings } from './updateSettings';
import { renderMap } from './mapbox';
import { bookTour } from './booking';

const mapEl = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const updateData = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');
const bookingBtn = document.getElementById('book-tour');

if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  // console.log(locations);
  renderMap(locations);
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Get values from the signup form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    //Signup user
    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Get values from the login form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //Login user
    login(email, password);
  });
}

if (logOut) {
  logOut.addEventListener('click', logout);
}

if (updateData) {
  updateData.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    //console.log(form);

    updateSettings(form, 'data');
  });
}

if (updatePassword) {
  updatePassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    document.querySelector('.btn--password').textContent = 'Updating...';
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    //After updating password, change button text-content back
    document.querySelector('.btn--password').textContent = 'Save password';
    //After updating password, clear input fields
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookingBtn) {
  bookingBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
