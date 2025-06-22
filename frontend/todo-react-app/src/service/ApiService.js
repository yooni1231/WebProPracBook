import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 token 파라미터 추출
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // 로컬스토리지에 저장
      localStorage.setItem("token", token);

      // 토큰에서 payload 디코딩 (Base64)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.userId || "unknown";
        localStorage.setItem("userId", userId);
        console.log("👤 로그인된 사용자:", userId);
      } catch (e) {
        console.error("JWT 디코딩 실패", e);
      }

      // 메인 페이지로 리디렉션
      navigate("/");
    } else {
      console.error("❌ 토큰이 없습니다.");
    }
  }, [navigate]);

  return <div>소셜 로그인 처리 중입니다...</div>;
};

export default SocialLogin;
