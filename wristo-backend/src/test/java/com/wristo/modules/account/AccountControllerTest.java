package com.wristo.modules.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.account.dto.UpdateCollectorProfileRequest;
import com.wristo.modules.account.entity.CollectorProfile;
import com.wristo.modules.account.entity.Salutation;
import com.wristo.modules.account.entity.VipTier;
import com.wristo.modules.account.repository.CollectorProfileRepository;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserAddressRepository;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.repository.PaymentRepository;
import com.wristo.modules.provenance.repository.AuthenticityCertificateRepository;
import com.wristo.modules.provenance.repository.ProvenanceRecordRepository;
import com.wristo.modules.provenance.repository.WatchServiceRecordRepository;
import com.wristo.security.jwt.JwtTokenProvider;
import com.wristo.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollectorProfileRepository profileRepository;

    @Autowired
    private UserAddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProvenanceRecordRepository provenanceRepository;

    @Autowired
    private AuthenticityCertificateRepository certificateRepository;

    @Autowired
    private WatchServiceRecordRepository serviceRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User collectorUser;
    private String collectorToken;

    @BeforeEach
    void setUp() {
        serviceRecordRepository.deleteAll();
        provenanceRepository.deleteAll();
        certificateRepository.deleteAll();
        paymentRepository.deleteAll();
        orderStatusHistoryRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        addressRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        collectorUser = new User(
                "collector.patron@wristo.luxury",
                passwordEncoder.encode("SecretPass123!"),
                "Viscount Henry Sterling",
                "+919876543210",
                "CUSTOMER"
        );
        collectorUser = userRepository.save(collectorUser);
        collectorToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(collectorUser));
    }

    @Test
    @DisplayName("GET /account/profile - Should return auto-created collector profile with defaults")
    void getProfile_Success() throws Exception {
        mockMvc.perform(get("/account/profile")
                        .header("Authorization", "Bearer " + collectorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.email", is("collector.patron@wristo.luxury")))
                .andExpect(jsonPath("$.data.fullName", is("Viscount Henry Sterling")))
                .andExpect(jsonPath("$.data.salutation", is("Collector")))
                .andExpect(jsonPath("$.data.vipTier", is("Grand Complication Patron")))
                .andExpect(jsonPath("$.data.wristSizeMm", is(175)))
                .andExpect(jsonPath("$.data.currency", is("INR")));
    }

    @Test
    @DisplayName("GET /account/profile - Should fail 401 Unauthorized without token")
    void getProfile_Unauthorized() throws Exception {
        mockMvc.perform(get("/account/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PUT /account/profile - Should update collector preferences, salutation and notifications")
    void updateProfile_Success() throws Exception {
        UpdateCollectorProfileRequest request = new UpdateCollectorProfileRequest(
                "Sir Henry Sterling",
                "+919988776655",
                "LORD",
                180,
                "USD",
                Map.of(
                        "orderTelemetry", true,
                        "rareAllocations", true,
                        "conciergeBriefings", true
                )
        );

        mockMvc.perform(put("/account/profile")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Sir Henry Sterling")))
                .andExpect(jsonPath("$.data.phone", is("+919988776655")))
                .andExpect(jsonPath("$.data.salutation", is("Lord")))
                .andExpect(jsonPath("$.data.wristSizeMm", is(180)))
                .andExpect(jsonPath("$.data.currency", is("USD")))
                .andExpect(jsonPath("$.data.notifications.conciergeBriefings", is(true)));
    }

    @Test
    @DisplayName("GET /account/dashboard - Should aggregate orders, total spend, and vault items")
    void getDashboard_Success() throws Exception {
        // Create an order for the collector
        Order order = new Order();
        order.setId("ord_test_account_01");
        order.setOrderNumber("WRT-2026-99001");
        order.setCertificateNumber("CERT-CHRONO-88001");
        order.setUser(collectorUser);
        order.setCustomerName("Viscount Henry Sterling");
        order.setCustomerEmail(collectorUser.getEmail());
        order.setCustomerPhone(collectorUser.getPhone());
        order.setShippingAddressLine1("Mayfair Horology Guild");
        order.setShippingCity("London");
        order.setShippingState("Greater London");
        order.setShippingPincode("W1K 7AA");
        order.setShippingCountry("UK");
        order.setDeliveryTier("insured_express");
        order.setSubtotalAmount(new BigDecimal("2500000.00"));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setGiftWrapFee(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setTaxAmount(new BigDecimal("450000.00"));
        order.setTotalAmount(new BigDecimal("2950000.00"));
        order.setCurrency("INR");
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaymentMethod(PaymentMethod.CARD);
        order.setPlacedAt(Instant.now());
        orderRepository.save(order);

        mockMvc.perform(get("/account/dashboard")
                        .header("Authorization", "Bearer " + collectorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalOrders", is(1)))
                .andExpect(jsonPath("$.data.activeOrders", is(1)))
                .andExpect(jsonPath("$.data.totalSpend", is(2950000.00)))
                .andExpect(jsonPath("$.data.profile.fullName", is("Viscount Henry Sterling")));
    }
}
