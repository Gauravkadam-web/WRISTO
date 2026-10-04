package com.wristo.modules.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.dto.LoginRequest;
import com.wristo.modules.auth.dto.RefreshTokenRequest;
import com.wristo.modules.auth.dto.RegisterRequest;
import com.wristo.modules.auth.entity.RefreshToken;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.RefreshTokenRepository;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.security.jwt.JwtTokenProvider;
import com.wristo.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterNewUserSuccessfully() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("geneva.collector@wristo.luxury");
        request.setPassword("HorologyMaster@2026");
        request.setFullName("Henri Stern");
        request.setPhone("+41221234567");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("geneva.collector@wristo.luxury"))
                .andExpect(jsonPath("$.data.user.fullName").value("Henri Stern"));
    }

    @Test
    void shouldRejectDuplicateEmailRegistration() throws Exception {
        User user = new User("duplicate@wristo.luxury", passwordEncoder.encode("Pass@12345"), "Existing User", null, "CUSTOMER");
        userRepository.save(user);

        RegisterRequest request = new RegisterRequest();
        request.setEmail("duplicate@wristo.luxury");
        request.setPassword("NewPass@12345");
        request.setFullName("Second User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("USER_ALREADY_EXISTS"));
    }

    @Test
    void shouldLoginWithValidCredentials() throws Exception {
        User user = new User("login.test@wristo.luxury", passwordEncoder.encode("Caliber9001!"), "Hans Wilsdorf", "+41229876543", "CUSTOMER");
        userRepository.save(user);

        LoginRequest request = new LoginRequest();
        request.setEmail("login.test@wristo.luxury");
        request.setPassword("Caliber9001!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("login.test@wristo.luxury"));
    }

    @Test
    void shouldRejectInvalidCredentials() throws Exception {
        User user = new User("wrong.pass@wristo.luxury", passwordEncoder.encode("CorrectPassword!"), "Louis Cartier", null, "CUSTOMER");
        userRepository.save(user);

        LoginRequest request = new LoginRequest();
        request.setEmail("wrong.pass@wristo.luxury");
        request.setPassword("WrongPassword!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    void shouldRefreshTokenSuccessfully() throws Exception {
        User user = new User("refresh.test@wristo.luxury", passwordEncoder.encode("Pass@123"), "Abraham Breguet", null, "CUSTOMER");
        user = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(user);
        String rawRefreshToken = jwtTokenProvider.generateRefreshToken(principal);
        RefreshToken rt = new RefreshToken(user, rawRefreshToken, Instant.now().plusSeconds(86400));
        refreshTokenRepository.save(rt);

        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken(rawRefreshToken);

        mockMvc.perform(post("/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty());
    }

    @Test
    void shouldGetMeProfileWithBearerToken() throws Exception {
        User user = new User("me.test@wristo.luxury", passwordEncoder.encode("Pass@123"), "Ferdinand Lange", "+4935053450", "CUSTOMER");
        user = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtTokenProvider.generateAccessToken(principal);

        mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("me.test@wristo.luxury"))
                .andExpect(jsonPath("$.data.fullName").value("Ferdinand Lange"));
    }
}
