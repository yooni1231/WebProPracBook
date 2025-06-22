package org.example.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.example.domain.UserEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class TokenProvider {


    private final String jwtSecret = "jkT1QxhOwrFOGkGUPDkTk1c1rH6ojU7uKbJ+b3hJab8";


    private final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 1일 (24시간)

    /**
     * OAuth 로그인 사용자로부터 JWT 생성
     */
    public String create(Authentication authentication) {
        ApplicationOAuth2User userPrincipal = (ApplicationOAuth2User) authentication.getPrincipal();
        return generateToken(userPrincipal.getName());
    }

    /**
     * 일반 사용자로부터 JWT 생성
     */
    public String create(UserEntity userEntity) {
        return generateToken(userEntity.getId());
    }

    /**
     * JWT 토큰에서 사용자 ID 추출 (검증 포함)
     */
    public String validateAndGetUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        log.info("검증 중인 토큰: " + token);

        return claims.getSubject();
    }

    /**
     * 공통 JWT 생성 로직
     */
    private String generateToken(String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuer("bookstore-app") // 앱 이름 지정
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes())
                .compact();
    }
}
