package com.wristo.modules.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.dto.UserAddressDto;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserAddressRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAddressRepository userAddressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User testUser;
    private String authToken;

    @BeforeEach
    void setUp() {
        userAddressRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User("collector.address@wristo.luxury", passwordEncoder.encode("Pass@123"), "Lord Harrison", "+442079460912", "CUSTOMER");
        testUser = userRepository.save(testUser);

        UserPrincipal principal = UserPrincipal.create(testUser);
        authToken = jwtTokenProvider.generateAccessToken(principal);
    }

    @Test
    void shouldAddAndListUserAddresses() throws Exception {
        UserAddressDto addressDto = new UserAddressDto();
        addressDto.setLabel("Mayfair Mansion");
        addressDto.setRecipientName("Lord Harrison");
        addressDto.setPhone("+442079460912");
        addressDto.setAddressLine1("10 Bond Street");
        addressDto.setCity("London");
        addressDto.setState("Greater London");
        addressDto.setPincode("W1S 2AA");
        addressDto.setCountry("United Kingdom");
        addressDto.setIsDefault(true);

        mockMvc.perform(post("/user/addresses")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.city").value("London"))
                .andExpect(jsonPath("$.data.isDefault").value(true));

        mockMvc.perform(get("/user/addresses")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].city").value("London"));
    }
}
