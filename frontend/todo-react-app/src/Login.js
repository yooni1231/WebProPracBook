import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleNormalLogin = () => {
    navigate('/signin'); // 일반 로그인 페이지로 이동
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    // Spring Boot 서버의 GitHub OAuth2 로그인 경로
  };

  const handleNormalSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '100px auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        로그인 방법 선택
      </Typography>

      <Stack spacing={3}>
        <Button variant="contained" fullWidth onClick={handleNormalLogin}>
          일반 로그인
        </Button>
        <Button variant="outlined" color="secondary" fullWidth onClick={handleNormalSignup}>
          일반 로그인 회원가입
        </Button>
        <Button variant="contained"  fullWidth onClick={handleGithubLogin}>
          GitHub 로그인
        </Button>
      </Stack>
    </div>
  );
}

export default Login;
