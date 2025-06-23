import React, { useState } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/signup', form);
      alert("회원가입 성공! 로그인 해주세요.");
      navigate('/signin');
    } catch (err) {
      setError('❌ 회원가입 실패: 아이디 중복 또는 서버 오류');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '100px auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        회원가입
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="아이디 (username)"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" type="submit" fullWidth>
            가입하기
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default Signup;
