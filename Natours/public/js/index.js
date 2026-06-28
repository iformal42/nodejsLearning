/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displaymap } from './mapbox';
import { updateDataSettings } from './updateSettings';

const mapEl = document.getElementById('map');
const loginForm = document.getElementById('login-from');
const profileForm = document.getElementById('setting-form');
const passwordForm = document.getElementById('form-password');
const logoutButton = document.querySelector('.nav__el--logout');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (mapEl) {
  const locations = JSON.parse(mapEl.dataset.locations);
  displaymap(locations);
}
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const photo = e.target.photo.files[0];
    console.log(e.target.photo.files);
    form.append('name', name);
    form.append('email', email);
    form.append('photo', photo);

    updateDataSettings(form, 'data');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.submitter;
    btn.textContent = 'Updating password...';
    btn.disabled = true;

    const currentPassword = e.target.currentpassword;
    const newPassword = e.target.newpassword;
    const passwordConfirm = e.target.confirmpassword;

    await updateDataSettings(
      {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        passwordConfirm: passwordConfirm.value,
      },
      'password',
    );
    currentPassword.value = '';
    newPassword.value = '';
    passwordConfirm.value = '';
    btn.textContent = 'SAVE PASSWORD';
    btn.disabled = false;
  });
}
