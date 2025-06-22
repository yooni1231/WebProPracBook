import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';
import BookRow from './BookRow';

// JWT 토큰을 Axios 요청에 자동 포함시키는 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    author: '',
    publisher: '',
    price: '',
    userId: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("ACCESS_TOKEN");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      navigate('/login'); // 로그인 안 된 경우 로그인 페이지로 이동
      return;
    }
    if (userId) {
      setForm((prev) => ({ ...prev, userId }));
    }
    fetchBooks();
  }, [userId, token, navigate]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:8080/books');
      setBooks(res.data);
    } catch (err) {
      console.error("도서 목록 조회 실패", err);
    }
  };

 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};


  const clearForm = () => {
    setForm({ id: null, title: '', author: '', publisher: '', price: '', userId: userId || '' });
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:8080/books', form);
      fetchBooks();
      clearForm();
    } catch (err) {
      alert("추가 실패: 로그인 또는 토큰 문제일 수 있습니다.");
    }
  };

  const handleSearch = async () => {
    console.log("검색어:", form.title);

    try {
      const res = await axios.get(`http://localhost:8080/books?title=${form.title}`);
      const book = res.data[0];
      if (book && book.id) {
        setForm(book);
      } else {
        alert("해당 도서가 없습니다.");
      }
    } catch (err) {
      alert("검색 실패");
    }
  };

  const handleUpdate = async () => {
    
    if (!form.id) return alert("검색 후 수정해주세요.");
    
    try {
      await axios.put('http://localhost:8080/books', form);
      fetchBooks();
      clearForm();
    } catch (err) {
      alert("수정 실패");
    }
  };

  const handleDelete = async () => {
    if (!form.id) return alert("검색 후 삭제해주세요.");
    try {
      await axios.delete('http://localhost:8080/books', { data: form });
      fetchBooks();
      clearForm();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleDeleteEmptyTitle = async () => {
    const emptyBooks = books.filter((book) => !book.title || book.title.trim() === "");
    for (const book of emptyBooks) {
      try {
        await axios.delete('http://localhost:8080/books', { data: book });
      } catch (e) {
        console.warn("삭제 실패 항목:", book);
      }
    }
    fetchBooks();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("userId");
    navigate('/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>도서관리</h2>

      <div style={{ marginBottom: 20 }}>
        {!token ? (
          <Button variant="outlined" color="primary" onClick={handleLogin}>
            로그인 페이지로 이동
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        )}
      </div>

      {token ? (
        <>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
              <TextField label="title" name="title" value={form.title} onChange={handleChange} />
              <TextField label="author" name="author" value={form.author} onChange={handleChange} />
              <TextField label="publisher" name="publisher" value={form.publisher} onChange={handleChange} />
              <TextField label="price" name="price" value={form.price} onChange={handleChange} />
              <TextField label="userId" name="userId" value={form.userId} disabled />
            </Stack>

            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={handleAdd}>제품 추가</Button>
              <Button variant="contained" onClick={handleSearch}>제품 검색</Button>
              <Button variant="contained" onClick={handleUpdate}>제품 수정</Button>
              <Button variant="contained" onClick={handleDelete}>제품 삭제</Button>
              <Button variant="outlined" color="error" onClick={handleDeleteEmptyTitle}>
                제목 없는 항목 삭제
              </Button>
            </Stack>
          </Stack>

          {books.length > 0 && (
            <>
              <h3 style={{ marginTop: 30 }}>제품 리스트</h3>
              <table>
                <thead>
                  <tr>
                    <th>아이디</th>
                    <th>제목</th>
                    <th>작가</th>
                    <th>출판사</th>
                    <th>가격</th>
                    <th>사용자Id</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <BookRow key={book.id} book={book} />
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      ) : (
        <p>로그인 후 사용 가능합니다.</p>
      )}
    </div>
  );
}

export default App;
