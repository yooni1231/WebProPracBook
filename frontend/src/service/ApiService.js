// src/api/apiService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
});

// 요청 전에 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 에러 응답 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 오류:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
