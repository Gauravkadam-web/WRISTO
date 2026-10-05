package com.wristo.modules.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.order.dto.UpdateOrderStatusRequest;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.repository.PaymentRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private com.wristo.modules.checkout.repository.CheckoutSessionRepository checkoutSessionRepository;

    @Autowired
    private com.wristo.modules.inventory.repository.InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private com.wristo.modules.inventory.repository.InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private com.wristo.modules.inventory.repository.InventoryRepository inventoryRepository;

    @Autowired
    private com.wristo.modules.seller.repository.SellerUserRepository sellerUserRepository;

    @Autowired
    private com.wristo.modules.seller.repository.SellerListingRepository sellerListingRepository;

    @Autowired
    private com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository brandAuthorizationRepository;

    @Autowired
    private com.wristo.modules.seller.repository.SellerRepository sellerRepository;

    @Autowired
    private com.wristo.modules.catalog.repository.WatchRepository watchRepository;

    @Autowired
    private com.wristo.modules.catalog.repository.BrandRepository brandRepository;

    @Autowired
    private com.wristo.modules.catalog.repository.CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User adminUser;
    private String adminToken;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        checkoutSessionRepository.deleteAll();
        paymentRepository.deleteAll();
        orderStatusHistoryRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        inventoryMovementRepository.deleteAll();
        inventoryReservationRepository.deleteAll();
        inventoryRepository.deleteAll();
        sellerUserRepository.deleteAll();
        sellerListingRepository.deleteAll();
        brandAuthorizationRepository.deleteAll();
        sellerRepository.deleteAll();
        watchRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = new User("admin.curator@wristo.luxury", passwordEncoder.encode("Pass@123"), "Master Curator", "+919999999999", "ADMIN");
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(adminUser));

        testOrder = new Order();
        testOrder.setId("ord_admin_001");
        testOrder.setOrderNumber("WRT-2026-90001");
        testOrder.setCertificateNumber("CERT-CHRONO-900001");
        testOrder.setCustomerName("Lady Eleanor");
        testOrder.setCustomerEmail("eleanor@wristo.luxury");
        testOrder.setCustomerPhone("+919876543210");
        testOrder.setShippingAddressLine1("44 Kensington High St");
        testOrder.setShippingCity("Mumbai");
        testOrder.setShippingState("Maharashtra");
        testOrder.setShippingPincode("400001");
        testOrder.setShippingCountry("India");
        testOrder.setDeliveryTier("white_glove");
        testOrder.setIsGiftWrapped(true);
        testOrder.setSubtotalAmount(BigDecimal.valueOf(25000.00));
        testOrder.setDiscountAmount(BigDecimal.ZERO);
        testOrder.setGiftWrapFee(BigDecimal.valueOf(500.00));
        testOrder.setShippingFee(BigDecimal.valueOf(1500.00));
        testOrder.setTaxAmount(BigDecimal.valueOf(4500.00));
        testOrder.setTotalAmount(BigDecimal.valueOf(31500.00));
        testOrder.setCurrency("INR");
        testOrder.setStatus(OrderStatus.CONFIRMED);
        testOrder.setPaymentStatus(PaymentStatus.PAID);
        testOrder.setPaymentMethod(PaymentMethod.CARD);
        testOrder.setPlacedAt(Instant.now());
        testOrder = orderRepository.save(testOrder);
    }

    @Test
    void shouldListAllOrdersForAdmin() throws Exception {
        mockMvc.perform(get("/admin/orders")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].orderNumber").value("WRT-2026-90001"));
    }

    @Test
    void shouldProgressOrderStateToProcessingVaultAndDispatched() throws Exception {
        // 1. Transition to PROCESSING_VAULT
        UpdateOrderStatusRequest vaultReq = new UpdateOrderStatusRequest(
                OrderStatus.PROCESSING_VAULT,
                "Horologist authenticated balance wheel and sealed case",
                null,
                null,
                null
        );

        mockMvc.perform(patch("/admin/orders/WRT-2026-90001/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vaultReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PROCESSING_VAULT"));

        // 2. Transition to DISPATCHED
        UpdateOrderStatusRequest dispatchReq = new UpdateOrderStatusRequest(
                OrderStatus.DISPATCHED,
                "Handed over to Boutique Armored Courier",
                "ARMOR-TRK-982341",
                "Boutique Armored Courier",
                Instant.now().plusSeconds(86400 * 2)
        );

        mockMvc.perform(patch("/admin/orders/WRT-2026-90001/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dispatchReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("DISPATCHED"))
                .andExpect(jsonPath("$.data.trackingNumber").value("ARMOR-TRK-982341"))
                .andExpect(jsonPath("$.data.courierPartner").value("Boutique Armored Courier"));
    }
}
