import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) navigate('/');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/auth/signin', form);
      const { token, id } = res.data;
      localStorage.setItem('ACCESS_TOKEN', token);
      localStorage.setItem('userId', id);
      navigate('/');
    } catch (err) {
      setError('❌ 로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '100px auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        일반 로그인
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
            로그인
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default Signin;
