package com.wristo.modules.checkout;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.dto.CartItemInput;
import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.checkout.dto.CompleteCheckoutRequest;
import com.wristo.modules.checkout.dto.CustomerAddressDto;
import com.wristo.modules.checkout.dto.InitiateCheckoutRequest;
import com.wristo.modules.checkout.repository.CheckoutSessionRepository;
import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.entity.DiscountType;
import com.wristo.modules.coupon.repository.CouponRepository;
import com.wristo.modules.inventory.entity.Inventory;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.repository.PaymentRepository;
import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerListing;
import com.wristo.modules.seller.entity.SellerStatus;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
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
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CheckoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CheckoutSessionRepository checkoutSessionRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private SellerBrandAuthorizationRepository brandAuthorizationRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private com.wristo.modules.seller.repository.SellerUserRepository sellerUserRepository;


    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.wristo.modules.provenance.repository.WatchServiceRecordRepository watchServiceRecordRepository;

    @Autowired
    private com.wristo.modules.provenance.repository.ProvenanceRecordRepository provenanceRecordRepository;

    @Autowired
    private com.wristo.modules.provenance.repository.AuthenticityCertificateRepository authenticityCertificateRepository;

    @Autowired
    private com.wristo.modules.account.repository.CollectorProfileRepository collectorProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private Watch watch1;
    private SellerListing listing1;
    private User customerUser;
    private String customerToken;
    private final String sessionId = UUID.randomUUID().toString();

    @BeforeEach
    void setUp() {
        watchServiceRecordRepository.deleteAll();
        provenanceRecordRepository.deleteAll();
        authenticityCertificateRepository.deleteAll();
        collectorProfileRepository.deleteAll();
        paymentRepository.deleteAll();
        orderStatusHistoryRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        checkoutSessionRepository.deleteAll();
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        couponRepository.deleteAll();
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

        customerUser = new User("checkout.collector@wristo.luxury", passwordEncoder.encode("Pass@123"), "Lord Stirling", "+919876543210", "CUSTOMER");
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(customerUser));

        Brand auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        auren = brandRepository.save(auren);

        Category men = new Category("cat-men", "men", "Men's Watches", "Men", "Masculine luxury", "male", 1, true);
        men = categoryRepository.save(men);

        watch1 = new Watch();
        watch1.setId("WRT-001");
        watch1.setNum("01");
        watch1.setBrand(auren);
        watch1.setBrandName("AUREN");
        watch1.setModel("Atlas Black");
        watch1.setPrice(BigDecimal.valueOf(10000.00));
        watch1.setOriginalPrice(BigDecimal.valueOf(12000.00));
        watch1.setImageUrl("/assets/products/watch-01.png");
        watch1.setCategory(men);
        watch1.setCategoryName("Men");
        watch1.setGender("Men");
        watch1.setMovement("Automatic");
        watch1.setStyle("Minimal");
        watch1.setCaseSize("40mm");
        watch1.setStrap("Leather");
        watch1.setDial("Black");
        watch1.setMaterial("Steel");
        watch1.setWaterResistance("50m");
        watch1.setTagline("Atlas Minimal");
        watch1.setDescription("Obsidian Black");
        watch1.setStockCount(10);
        watch1.setIsActive(true);
        watch1 = watchRepository.save(watch1);

        Seller seller = new Seller("seller-boutique", "AUREN Boutique London", "Auren UK Ltd", "GB123456789", "AURENUK", "1234567890", "BARC0001234");
        seller.setStatus(SellerStatus.VERIFIED);
        seller.setIsActive(true);
        seller = sellerRepository.save(seller);

        listing1 = new SellerListing();
        listing1.setSeller(seller);
        listing1.setWatch(watch1);
        listing1.setSellerSku("SKU-AUR-LONDON-01");
        listing1.setPrice(BigDecimal.valueOf(10000.00));
        listing1.setOriginalPrice(BigDecimal.valueOf(12000.00));
        listing1.setStatus(ListingStatus.ACTIVE);
        listing1.setIsActive(true);
        listing1 = sellerListingRepository.save(listing1);

        Inventory inventory = new Inventory();
        inventory.setSellerListing(listing1);
        inventory.setAvailableQuantity(10);
        inventory.setReservedQuantity(0);
        inventory.setSoldQuantity(0);
        inventory.setTotalQuantity(10);
        inventoryRepository.save(inventory);

        Coupon coupon = new Coupon();
        coupon.setId(UUID.randomUUID().toString());
        coupon.setCode("WRISTO10");
        coupon.setDescription("10% luxury discount");
        coupon.setDiscountType(DiscountType.PERCENTAGE);
        coupon.setDiscountValue(BigDecimal.valueOf(10.00));
        coupon.setMinSubtotal(BigDecimal.valueOf(2000.00));
        coupon.setMaxDiscount(BigDecimal.valueOf(2000.00));
        coupon.setUsageLimit(100);
        coupon.setTimesUsed(0);
        coupon.setStartsAt(Instant.now().minus(1, ChronoUnit.DAYS));
        coupon.setExpiresAt(Instant.now().plus(60, ChronoUnit.DAYS));
        coupon.setIsActive(true);
        couponRepository.save(coupon);
    }

    @Test
    void shouldInitiateCheckoutWithStockHold() throws Exception {
        InitiateCheckoutRequest initiateReq = new InitiateCheckoutRequest(
                List.of(new CartItemInput("WRT-001", 1)),
                "WRISTO10",
                "insured_express",
                true,
                "Happy Birthday"
        );

        mockMvc.perform(post("/checkout/initiate")
                        .header("Authorization", "Bearer " + customerToken)
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initiateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.checkoutSessionId").isNotEmpty())
                .andExpect(jsonPath("$.data.expiresAt").isNotEmpty())
                .andExpect(jsonPath("$.data.totals.subtotal").value(10000.00))
                .andExpect(jsonPath("$.data.totals.discount").value(1000.00))
                .andExpect(jsonPath("$.data.totals.giftWrapFee").value(500.00));
    }

    @Test
    void shouldCompleteCheckoutAndIssueCertifiedOrder() throws Exception {
        // 1. Initiate checkout
        InitiateCheckoutRequest initiateReq = new InitiateCheckoutRequest(
                List.of(new CartItemInput("WRT-001", 1)),
                "WRISTO10",
                "insured_express",
                false,
                null
        );

        MvcResult initResult = mockMvc.perform(post("/checkout/initiate")
                        .header("Authorization", "Bearer " + customerToken)
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initiateReq)))
                .andExpect(status().isOk())
                .andReturn();

        String initJson = initResult.getResponse().getContentAsString();
        String checkoutSessionId = objectMapper.readTree(initJson).path("data").path("checkoutSessionId").asText();

        // 2. Complete checkout
        CustomerAddressDto address = new CustomerAddressDto(
                "Lord Stirling",
                "checkout.collector@wristo.luxury",
                "+919876543210",
                "400001",
                "10 Mayfair Tower, Nariman Point",
                "Suite 402",
                "Mumbai",
                "Maharashtra",
                "Near Oberoi Hotel",
                "Call concierge upon arrival"
        );

        CompleteCheckoutRequest completeReq = new CompleteCheckoutRequest(
                checkoutSessionId,
                List.of(new CartItemInput("WRT-001", 1)),
                address,
                PaymentMethod.CARD,
                "insured_express",
                false,
                null,
                "WRISTO10",
                "txn_mock_98234",
                "order_rzp_mock_123",
                "pay_mock_456",
                "sig_mock_789"
        );

        mockMvc.perform(post("/checkout/complete")
                        .header("Authorization", "Bearer " + customerToken)
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(completeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value(org.hamcrest.Matchers.startsWith("WRT-2026-")))
                .andExpect(jsonPath("$.data.certificateNumber").value(org.hamcrest.Matchers.startsWith("CERT-CHRONO-")))
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.data.paymentStatus").value("PAID"))
                .andExpect(jsonPath("$.data.customerName").value("Lord Stirling"))
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].watchId").value("WRT-001"));
    }
}
