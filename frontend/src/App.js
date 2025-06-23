import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';
import BookRow from './BookRow';
import api from './service/ApiService';

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
  console.log("App 렌더링됨")

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    author: '',
    publisher: '',
    price: '',
    genre: '',
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
  setForm((prev) => ({
    ...prev,
    [name]: name === "price" ? value.replace(/[^0-9.]/g, '') : value
  }));

 };


  const clearForm = () => {
    setForm({ id: null, title: '', author: '', publisher: '', price: '', userId: userId || '' });
  };

const handleAdd = async () => {
  const fixedForm = {
    ...form,
    price: form.price ? parseFloat(form.price) : 0  // 숫자 변환 (빈칸이면 0)
  };

  console.log("📤 최종 전송:", fixedForm);

  try {
    await api.post("http://localhost:8080/books", fixedForm);
    fetchBooks();
    clearForm();
  } catch (err) {
    alert("📛 도서 추가 실패: " + (err.response?.data?.message || err.message));
    console.error("📛 AxiosError", err);
  }
};

const handleSearch = async () => {
  const title = form.title.trim();
  try {
    const res = await axios.get(`http://localhost:8080/books?title=${encodeURIComponent(title)}`);
    const book = res.data[0]; 
    if (book && book.id) {
      setForm(book); //
    } else {
      alert("해당 도서가 없습니다.");
    }
  } catch (err) {
    alert("검색 실패");
    console.error(err);
  }
};


const handleUpdate = async () => {
  if (!form.id) return alert("검색 후 수정해주세요.");

  const updatedForm = {
    id: form.id,
    title: form.title,
    author: form.author,
    publisher: form.publisher,
    price: form.price && !isNaN(form.price) ? parseFloat(form.price) : 0,
    genre: form.genre || "",       
    userId: form.userId || "LeeYunseo" 
  };

  console.log("📤 수정 요청:", updatedForm);

  try {
    await axios.put("http://localhost:8080/books", updatedForm);
    fetchBooks();
    clearForm();
  } catch (err) {
    alert("수정 실패: " + (err.response?.data?.message || err.message));
    console.error("❌ AxiosError:", err);
  }
};


const handleDelete = async () => {
  if (!form.id) return alert("검색 후 삭제해주세요.");
  console.log("삭제 요청 ID:", form.id);

  try {
    // ✅ DTO 형태로 삭제 요청
    await axios.delete("http://localhost:8080/books", {
      data: { id: form.id }
    });
    fetchBooks();
    clearForm();
  } catch (err) {
    alert("삭제 실패");
    console.error(err);
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

  const handleSearchFromYes24 = async () => {
   const trimmedTitle = form.title?.trim();

   if (!trimmedTitle) {
    alert("제목을 입력해주세요.");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:8080/books/search-from-yes24?title=${encodeURIComponent(trimmedTitle)}`);
    const book = res.data;
    console.log("요청 URL:", `http://localhost:8080/books/search-from-yes24?title=${encodeURIComponent(trimmedTitle)}`);

    if (book && book.title) {
      setForm(prev => ({ ...prev, ...book }));
    } else {
      alert("Yes24에서 도서를 찾을 수 없습니다.");
    }
  } catch (err) {
    console.error(err);
    alert("Yes24 검색 실패");
  }
};

const handleGenreSearch = async () => {
  const trimmedGenre = form.genre?.trim();

  if (!trimmedGenre) {
    alert("장르를 입력해주세요.");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:8080/books?genre=${encodeURIComponent(trimmedGenre)}`);
    setBooks(res.data);
  } catch (err) {
    alert("장르 검색 실패");
    console.error(err);
  }
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
              <TextField label="price" name="price" type="number" value={form.price} onChange={handleChange} />
              <TextField label="genre" name="genre" value={form.genre} onChange={handleChange} />
              <TextField label="userId" name="userId" value={form.userId} disabled />

            </Stack>

            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={handleAdd}>도서추가</Button>
              <Button variant="contained" onClick={handleSearch}>도서 검색</Button>
              <Button variant="contained" onClick={handleUpdate}>도서 수정</Button>
              <Button variant="contained" onClick={handleDelete}>도서 삭제</Button>
              <Button variant="outlined" onClick={handleSearchFromYes24}> Yes24에서 검색</Button>
              <Button variant="outlined" onClick={handleGenreSearch}>장르로 검색</Button>

              
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
                    <th>장르</th>
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
