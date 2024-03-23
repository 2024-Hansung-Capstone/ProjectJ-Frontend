import React, { useState } from 'react';
import './css/Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import SIGN_UP from './gql/Signup';

const Signup = () => {
  const navigate = useNavigate();
  const [isAgeChecked, setAgeChecked] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [isPrivacyChecked, setPrivacyChecked] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  console.log(SIGN_UP)
  const [signUp] = useMutation(SIGN_UP)

  const handleSignup = () => {
    const newErrorMessages = [];

    const nameInput = document.getElementById('nameInput');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const emailInput = document.getElementById('emailInput');
    const yearInput = document.getElementById('yearInput');
    const monthInput = document.getElementById('monthInput');
    const dayInput = document.getElementById('dayInput');

   

    setErrorMessages([]);

    if (!nameInput.value) {
      newErrorMessages.push('이름을 입력해주십시오.');
    }
    if (!usernameInput.value) {
      newErrorMessages.push('아이디를 입력해주십시오.');
    }
    if (!passwordInput.value) {
      newErrorMessages.push('비밀번호를 입력해주십시오.');
    }
    if (!confirmPasswordInput.value) {
      newErrorMessages.push('비밀번호를 다시 입력해주십시오.');
    }
    if (!emailInput.value) {
      newErrorMessages.push('이메일을 입력해주십시오.');
    }
    if (!yearInput.value || !monthInput.value || !dayInput.value) {
      newErrorMessages.push('생년월일을 입력해주십시오.');
    }
    if (!isAgeChecked) {
      newErrorMessages.push('만 14세 이상입니다.');
    }
    if (!isTermsChecked || !isPrivacyChecked) {
      newErrorMessages.push('약관에 동의해주십시오.');
    }

    setErrorMessages(newErrorMessages);

    if (newErrorMessages.length === 0) {
      console.log('회원가입 버튼이 클릭되었습니다.');
      navigate('/');
    } else {
      alert('입력값을 확인하고 약관에 동의해주십시오.');
    }
  };

  const generateOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Promise -> Node js 비동기 처리
    // await 비동기가 끝날때까지 기다려줌
    try {
      const res= await signUp({variables: {
        id: document.getElementById('usernameInput').value,
        name: document.getElementById('nameInput').value,
        password: document.getElementById('passwordInput').value,
        email: document.getElementById('emailInput').value,
        gender: document.getElementById('genderSelect').value,
        birth_at: `${document.getElementById('yearInput').value}-${document.getElementById('monthInput').value}-${document.getElementById('dayInput').value}`,
      
        // ...
      }})
      console.log('res', res)
    } catch(e){
      console.log(e)
    }
    

    // 결과를 출력
   
  }

  return (
    <div className="signup-form-container">
      <h2 className="signup-form-title">회원가입</h2>
      <form onSubmit={handleSubmit} >
        <div className="signup-form-item" style={{ borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
          <input
            type="text"
            placeholder="이름"
            id="nameInput"
          />
        </div>
        <div className="signup-form-item">
          <input
            type="text"
            placeholder="아이디"
            id="usernameInput"
          />
        </div>
        <div className="signup-form-item">
          <input
            type="password"
            placeholder="비밀번호"
            id="passwordInput"
          />
        </div>
        <div className="signup-form-item">
          <input
            type="password"
            placeholder="비밀번호 확인"
            id="confirmPasswordInput"
          />
        </div>
        <div className="signup-form-item">
          <input
            type="text"
            placeholder="이메일"
            id="emailInput"
          />
        </div>
        <div className="signup-form-item">
          <select id="genderSelect">
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <div className="signup-form-item">
          <div className="date-picker">
            <select className="date-input" name="year" id="yearInput">
              <option value="">연도</option>
              {generateOptions(1930, 2024)}
            </select>
            <select className="date-input" name="month" id="monthInput">
              <option value="">월</option>
              {generateOptions(1, 12)}
            </select>
            <select className="date-input" name="day" id="dayInput">
              <option value="">일</option>
              {generateOptions(1, 31)}
            </select>
          </div>
        </div>

        <div className="signup-form-item checkbox">
          <input
            type="checkbox"
            id="ageCheckbox"
            onChange={() => setAgeChecked(!isAgeChecked)}
          />
          <label htmlFor="ageCheckbox">[필수] 만 14세 이상입니다.</label>
        </div>

        <div className="signup-form-item checkbox">
          <input
            type="checkbox"
            id="termsCheckbox"
            onChange={() => setTermsChecked(!isTermsChecked)}
          />
          <label htmlFor="termsCheckbox">
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">[필수] 회원가입 및 운영약관 동의</a>
          </label>
        </div>

        <div className="signup-form-item checkbox">
          <input
            type="checkbox"
            id="privacyCheckbox"
            onChange={() => setPrivacyChecked(!isPrivacyChecked)}
          />
          <label htmlFor="privacyCheckbox">[필수] 개인정보 수집 및 이용 동의</label>
        </div>

        <div className="signup-form-item checkbox">
          <input type="checkbox" id="marketingCheckbox" />
          <label htmlFor="marketingCheckbox">[선택] 마케팅 이용 동의</label>
        </div>

        <div className="signup-form-item">
          <button type="submit" className="signup-form-button">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
