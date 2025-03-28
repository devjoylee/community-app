import Validator from '/src/js/utils/validate.js';
import { AuthAPI } from '/src/api/authAPI.js';
import { fileToBase64 } from '/src/js/utils/fileToBase64.js';

const signupBtn = document.getElementById('signupBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const nicknameInput = document.getElementById('nickname');
const profileInput = document.getElementById('profile');
const thumbnail = document.querySelector('.thumbnail-btn');

const emailErrorMsg = document.querySelector('#signupPage .email-error');
const password1ErrorMsg = document.querySelector('#signupPage .password1-error');
const password2ErrorMsg = document.querySelector('#signupPage .password2-error');
const nicknameErrorMsg = document.querySelector('#signupPage .nickname-error');
const profileErrorMsg = document.querySelector('#signupPage .profile-error');

const updateThumbnail = (e) => {
  const file = e.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      thumbnail.style.backgroundImage = `url(${e.target.result})`;
      thumbnail.classList.add('has-image');
      thumbnail.innerHTML = ''; // + 아이콘 제거
      Validator.profileImage(file, profileErrorMsg);
    };
    reader.readAsDataURL(file);
  }

  handleInput(); // 입력 상태 확인
};

emailInput.addEventListener('blur', () => {
  const email = emailInput.value.trim();
  Validator.email(email, emailErrorMsg);
});

passwordInput.addEventListener('blur', () => {
  const password = passwordInput.value;
  Validator.password(password, password1ErrorMsg);
});

password2Input.addEventListener('blur', () => {
  const password = passwordInput.value;
  const password2 = password2Input.value;
  Validator.passwordConfirm(password, password2, password2ErrorMsg);
});

nicknameInput.addEventListener('blur', () => {
  const nickname = nicknameInput.value.trim();
  Validator.nickname(nickname, nicknameErrorMsg);
});

const handleInput = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const password2 = password2Input.value;
  const nickname = nicknameInput.value.trim();
  const profileFile = profileInput.files[0];

  const isEmailValid = Validator.email(email, emailErrorMsg);
  const isPasswordValid = Validator.password(password, password1ErrorMsg);
  const isPasswordConfirmValid = Validator.passwordConfirm(password, password2, password2ErrorMsg);
  const isNicknameValid = Validator.nickname(nickname, nicknameErrorMsg);
  const isProfileValid = Validator.profileImage(profileFile, profileErrorMsg);

  const isFormValid =
    isEmailValid && isPasswordValid && isPasswordConfirmValid && isNicknameValid && isProfileValid;

  if (isFormValid) {
    signupBtn.classList.add('active');
    signupBtn.disabled = false;
  } else {
    signupBtn.classList.remove('active');
    signupBtn.disabled = true;
  }
};

const handleSignup = async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const nickname = nicknameInput.value.trim();
  const profileFile = profileInput.files[0];

  if (await AuthAPI.isEmailDuplicate(email)) {
    emailErrorMsg.textContent = '이미 사용 중인 이메일입니다.';
    signupBtn.disabled = false;
  }

  if (await AuthAPI.isNicknameDuplicate(nickname)) {
    nicknameErrorMsg.textContent = '이미 사용 중인 닉네임입니다.';
    signupBtn.disabled = false;
    return;
  }

  try {
    let profileImageBase64 = '';
    if (profileFile) {
      profileImageBase64 = await fileToBase64(profileFile);
    }

    const userData = {
      email,
      password,
      nickname,
      profileImage: profileImageBase64,
    };

    const res = await AuthAPI.register(userData);

    if (res.success) {
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/pages/auth/login.html';
    } else {
      alert(res.message || '회원가입 처리 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error);
    alert('회원가입 처리 중 오류가 발생했습니다.');
    signupBtn.disabled = false;
  }
};

[emailInput, passwordInput, password2Input, nicknameInput].forEach((input) => {
  input.addEventListener('input', handleInput);
});

profileInput.addEventListener('change', updateThumbnail);
signupBtn.addEventListener('click', handleSignup);

// 초기 버튼 상태 설정
signupBtn.classList.remove('active');
signupBtn.disabled = true;
