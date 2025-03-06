import Validator from './utils/validate.js';
import API from '../api/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await API.initData();

  const currentUser = API.user.getCurrentUser();
  if (currentUser) {
    window.location.href = '/';
    return;
  }
});

const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailErrorMsg = document.querySelector('#loginPage .email-error');
const passwordErrorMsg = document.querySelector('#loginPage .password-error');

emailInput.addEventListener('blur', () => {
  const email = emailInput.value.trim();
  Validator.email(email, emailErrorMsg);
});

passwordInput.addEventListener('blur', () => {
  const password = passwordInput.value;
  Validator.password(password, passwordErrorMsg);
});

const handleInput = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const isFormValid =
    Validator.email(email, emailErrorMsg) && Validator.password(password, passwordErrorMsg);

  if (email && password && isFormValid) {
    loginBtn.classList.add('active');
    loginBtn.disabled = false;
  } else {
    loginBtn.classList.remove('active');
    loginBtn.disabled = true;
  }
};

const handleLogin = (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const isEmailValid = Validator.email(email, emailErrorMsg);
  const isPasswordValid = Validator.password(password, passwordErrorMsg);

  if (isEmailValid && isPasswordValid) {
    const res = API.user.login(email, password);

    if (res.success) {
      window.location.href = '/';
    } else {
      window.alert(res.message);
    }
  }
};

emailInput.addEventListener('input', handleInput);
passwordInput.addEventListener('input', handleInput);
loginBtn.addEventListener('click', handleLogin);

loginBtn.classList.remove('active');
loginBtn.disabled = true;
