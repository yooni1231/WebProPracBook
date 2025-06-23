import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      //  일관된 키명으로 저장
      localStorage.setItem("ACCESS_TOKEN", token);

      //  JWT Payload 디코딩하여 userId 추출
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.userId || "unknown";
        localStorage.setItem("userId", userId);
        console.log("👤 로그인된 사용자:", userId);
      } catch (e) {
        console.error("❌ JWT 디코딩 실패", e);
      }

      navigate("/");
    } else {
      console.error("❌ 토큰이 없습니다.");
    }
  }, [navigate]);

  return <div>소셜 로그인 처리 중입니다...</div>;
};

export default SocialLogin;
