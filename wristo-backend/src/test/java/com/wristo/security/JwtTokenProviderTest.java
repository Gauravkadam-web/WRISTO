package com.wristo.security;

import com.wristo.modules.auth.entity.User;
import com.wristo.security.jwt.JwtTokenProvider;
import com.wristo.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expirationMs = 3600000; // 1 hour
    private final long refreshExpirationMs = 604800000; // 7 days

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret, expirationMs, refreshExpirationMs);
    }

    @Test
    void shouldGenerateAndValidateToken() {
        UUID userId = UUID.randomUUID();
        User user = new User("collector@auren.ch", "hashedpass", "Auren Collector", "+919876543210", "CUSTOMER");
        user.setId(userId);
        UserPrincipal principal = UserPrincipal.create(user);

        String token = jwtTokenProvider.generateAccessToken(principal);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(userId, jwtTokenProvider.getUserIdFromToken(token));
    }

    @Test
    void shouldRejectMalformedToken() {
        String malformedToken = "not.a.valid.jwt.token";
        assertFalse(jwtTokenProvider.validateToken(malformedToken));
    }
}
