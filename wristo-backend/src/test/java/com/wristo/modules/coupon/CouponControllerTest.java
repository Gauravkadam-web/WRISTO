package com.wristo.modules.coupon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.coupon.dto.CreateCouponRequest;
import com.wristo.modules.coupon.dto.UpdateCouponRequest;
import com.wristo.modules.coupon.dto.ValidateCouponRequest;
import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.entity.DiscountType;
import com.wristo.modules.coupon.repository.CouponRepository;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CouponControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private User adminUser;
    private User customerUser;
    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() {
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        couponRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = new User("admin.horology@wristo.luxury", passwordEncoder.encode("AdminPass@123"), "Vault Director", "+442079460999", "ADMIN");
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(adminUser));

        customerUser = new User("collector@wristo.luxury", passwordEncoder.encode("CustPass@123"), "Lord Harrison", "+442079460912", "CUSTOMER");
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(customerUser));

        Coupon coupon10 = new Coupon();
        coupon10.setId(UUID.randomUUID().toString());
        coupon10.setCode("WRISTO10");
        coupon10.setDescription("10% off luxury horology");
        coupon10.setDiscountType(DiscountType.PERCENTAGE);
        coupon10.setDiscountValue(BigDecimal.valueOf(10.00));
        coupon10.setMinSubtotal(BigDecimal.valueOf(2000.00));
        coupon10.setMaxDiscount(BigDecimal.valueOf(5000.00));
        coupon10.setUsageLimit(500);
        coupon10.setTimesUsed(0);
        coupon10.setStartsAt(Instant.now().minus(1, ChronoUnit.DAYS));
        coupon10.setExpiresAt(Instant.now().plus(90, ChronoUnit.DAYS));
        coupon10.setIsActive(true);
        couponRepository.save(coupon10);

        Coupon fixed500 = new Coupon();
        fixed500.setId(UUID.randomUUID().toString());
        fixed500.setCode("HOROLOGY500");
        fixed500.setDescription("£500 voucher");
        fixed500.setDiscountType(DiscountType.FIXED);
        fixed500.setDiscountValue(BigDecimal.valueOf(500.00));
        fixed500.setMinSubtotal(BigDecimal.valueOf(3000.00));
        fixed500.setUsageLimit(100);
        fixed500.setTimesUsed(0);
        fixed500.setStartsAt(Instant.now().minus(1, ChronoUnit.DAYS));
        fixed500.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        fixed500.setIsActive(true);
        couponRepository.save(fixed500);
    }

    @Test
    void shouldValidatePercentageCouponSuccessfully() throws Exception {
        ValidateCouponRequest request = new ValidateCouponRequest("WRISTO10", BigDecimal.valueOf(10000.00));

        mockMvc.perform(post("/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.code").value("WRISTO10"))
                .andExpect(jsonPath("$.data.discountType").value("PERCENTAGE"))
                .andExpect(jsonPath("$.data.calculatedDiscount").value(1000.00));
    }

    @Test
    void shouldValidateFixedCouponSuccessfully() throws Exception {
        ValidateCouponRequest request = new ValidateCouponRequest("HOROLOGY500", BigDecimal.valueOf(5000.00));

        mockMvc.perform(post("/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.code").value("HOROLOGY500"))
                .andExpect(jsonPath("$.data.discountType").value("FIXED"))
                .andExpect(jsonPath("$.data.calculatedDiscount").value(500.00));
    }

    @Test
    void shouldRejectCouponWhenSubtotalBelowMinimum() throws Exception {
        ValidateCouponRequest request = new ValidateCouponRequest("WRISTO10", BigDecimal.valueOf(1500.00));

        mockMvc.perform(post("/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("COUPON_MIN_SUBTOTAL_NOT_MET"));
    }

    @Test
    void shouldRejectNonExistentCoupon() throws Exception {
        ValidateCouponRequest request = new ValidateCouponRequest("INVALIDCODE99", BigDecimal.valueOf(10000.00));

        mockMvc.perform(post("/coupons/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("COUPON_NOT_FOUND"));
    }

    @Test
    void shouldReturnActiveCoupons() throws Exception {
        mockMvc.perform(get("/coupons/active")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void shouldAllowAdminToCreateAndManageCoupons() throws Exception {
        CreateCouponRequest createRequest = new CreateCouponRequest(
                "VIPNOEL",
                "Holiday Privileges",
                DiscountType.PERCENTAGE,
                BigDecimal.valueOf(15.00),
                BigDecimal.valueOf(5000.00),
                BigDecimal.valueOf(2500.00),
                50,
                Instant.now().minus(1, ChronoUnit.DAYS),
                Instant.now().plus(30, ChronoUnit.DAYS)
        );

        mockMvc.perform(post("/admin/coupons")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.code").value("VIPNOEL"))
                .andExpect(jsonPath("$.data.discountValue").value(15.00));

        mockMvc.perform(get("/admin/coupons")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.length()").value(3));

        UpdateCouponRequest updateRequest = new UpdateCouponRequest(
                "Updated Holiday Privileges",
                DiscountType.PERCENTAGE,
                BigDecimal.valueOf(15.00),
                BigDecimal.valueOf(5000.00),
                BigDecimal.valueOf(2500.00),
                50,
                Instant.now().minus(1, ChronoUnit.DAYS),
                Instant.now().plus(30, ChronoUnit.DAYS),
                false
        );

        mockMvc.perform(put("/admin/coupons/VIPNOEL")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.description").value("Updated Holiday Privileges"))
                .andExpect(jsonPath("$.data.isActive").value(false));

        mockMvc.perform(delete("/admin/coupons/VIPNOEL")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void shouldDenyCustomerFromAdminCouponEndpoints() throws Exception {
        mockMvc.perform(get("/admin/coupons")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
