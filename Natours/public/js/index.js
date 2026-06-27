/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { displaymap } from './mapbox';
console.log('parcel');
const mapEl = document.getElementById('map');
const loginForm = document.querySelector('.form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    console.log('Submit event fired');
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
