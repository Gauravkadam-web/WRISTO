package com.wristo.modules.provenance;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.account.repository.CollectorProfileRepository;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderItem;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.repository.PaymentRepository;
import com.wristo.modules.provenance.dto.CreateServiceRecordRequest;
import com.wristo.modules.provenance.entity.AuthenticityCertificate;
import com.wristo.modules.provenance.entity.ProvenanceRecord;
import com.wristo.modules.provenance.entity.ServiceType;
import com.wristo.modules.provenance.repository.AuthenticityCertificateRepository;
import com.wristo.modules.provenance.repository.ProvenanceRecordRepository;
import com.wristo.modules.provenance.repository.WatchServiceRecordRepository;
import com.wristo.modules.provenance.service.CertificateService;
import com.wristo.modules.provenance.service.ProvenanceService;
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
import java.util.List;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProvenanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WatchServiceRecordRepository serviceRecordRepository;

    @Autowired
    private ProvenanceRecordRepository provenanceRepository;

    @Autowired
    private AuthenticityCertificateRepository certificateRepository;

    @Autowired
    private CollectorProfileRepository collectorProfileRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private ProvenanceService provenanceService;

    @Autowired
    private com.wristo.modules.wishlist.repository.WishlistItemRepository wishlistItemRepository;

    @Autowired
    private com.wristo.modules.wishlist.repository.WishlistRepository wishlistRepository;

    @Autowired
    private com.wristo.modules.cart.repository.CartItemRepository cartItemRepository;

    @Autowired
    private com.wristo.modules.cart.repository.CartRepository cartRepository;

    @Autowired
    private com.wristo.modules.coupon.repository.CouponRepository couponRepository;

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User collectorUser;
    private String collectorToken;
    private User adminUser;
    private String adminToken;
    private Watch testWatch;
    private Order testOrder;
    private AuthenticityCertificate testCertificate;
    private ProvenanceRecord testProvenance;

    @BeforeEach
    void setUp() {
        serviceRecordRepository.deleteAll();
        provenanceRepository.deleteAll();
        certificateRepository.deleteAll();
        collectorProfileRepository.deleteAll();
        paymentRepository.deleteAll();
        orderStatusHistoryRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        wishlistItemRepository.deleteAll();
        wishlistRepository.deleteAll();
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

        // 1. Create Users
        collectorUser = new User("duke.wellington@wristo.luxury", passwordEncoder.encode("Pass@123"), "Duke of Wellington", "+919876543210", "CUSTOMER");
        collectorUser = userRepository.save(collectorUser);
        collectorToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(collectorUser));

        adminUser = new User("vault.director@wristo.luxury", passwordEncoder.encode("AdminPass@123"), "Adrien de Beauharnais", "+919123456780", "ADMIN");
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(adminUser));

        // 2. Create Brand & Category & Watch
        Brand auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        auren = brandRepository.save(auren);

        Category grandComp = new Category("cat-grand-comp", "grand-complications", "Grand Complications", "Grand Comp", "High complications", "watch", 1, true);
        grandComp = categoryRepository.save(grandComp);

        testWatch = new Watch();
        testWatch.setId("auren-atlas-chrono-prov");
        testWatch.setNum("WRT-001");
        testWatch.setBrand(auren);
        testWatch.setBrandName(auren.getName());
        testWatch.setCategory(grandComp);
        testWatch.setCategoryName(grandComp.getTitle());
        testWatch.setModel("Atlas Chrono 1928");
        testWatch.setPrice(new BigDecimal("2850000.00"));
        testWatch.setOriginalPrice(new BigDecimal("3000000.00"));
        testWatch.setGender("Unisex");
        testWatch.setMovement("Manufacture Calibre AU-8800");
        testWatch.setStyle("Chronograph");
        testWatch.setCaseSize("41mm");
        testWatch.setStrap("Hand-stitched Alligator");
        testWatch.setDial("Midnight Sunburst");
        testWatch.setMaterial("Grade 5 Titanium");
        testWatch.setWaterResistance("100m");
        testWatch.setTagline("Chronograph Masterpiece");
        testWatch.setDescription("Perpetual luxury chronograph");
        testWatch.setIsActive(true);
        testWatch.setStockCount(5);
        testWatch.setImageUrl("/assets/watches/atlas-chrono.webp");
        testWatch = watchRepository.save(testWatch);

        // 3. Create Order
        testOrder = new Order();
        testOrder.setId("ord_test_prov_01");
        testOrder.setOrderNumber("WRT-2026-77001");
        testOrder.setCertificateNumber("CERT-CHRONO-991122");
        testOrder.setUser(collectorUser);
        testOrder.setCustomerName(collectorUser.getFullName());
        testOrder.setCustomerEmail(collectorUser.getEmail());
        testOrder.setCustomerPhone(collectorUser.getPhone());
        testOrder.setShippingAddressLine1("Rue du Rhône 42");
        testOrder.setShippingCity("Geneva");
        testOrder.setShippingState("Geneva");
        testOrder.setShippingPincode("1204");
        testOrder.setShippingCountry("Switzerland");
        testOrder.setDeliveryTier("insured_express");
        testOrder.setSubtotalAmount(new BigDecimal("2850000.00"));
        testOrder.setDiscountAmount(BigDecimal.ZERO);
        testOrder.setGiftWrapFee(BigDecimal.ZERO);
        testOrder.setShippingFee(BigDecimal.ZERO);
        testOrder.setTaxAmount(new BigDecimal("513000.00"));
        testOrder.setTotalAmount(new BigDecimal("3363000.00"));
        testOrder.setCurrency("INR");
        testOrder.setStatus(OrderStatus.CONFIRMED);
        testOrder.setPaymentStatus(PaymentStatus.PAID);
        testOrder.setPaymentMethod(PaymentMethod.CARD);
        testOrder.setPlacedAt(Instant.now());
        testOrder = orderRepository.save(testOrder);

        OrderItem orderItem = new OrderItem();
        orderItem.setId("item_prov_01");
        orderItem.setOrder(testOrder);
        orderItem.setWatch(testWatch);
        orderItem.setWatchModel(testWatch.getModel());
        orderItem.setWatchBrand(testWatch.getBrandName());
        orderItem.setWatchImageUrl(testWatch.getImageUrl());
        orderItem.setMovementType(testWatch.getMovement());
        orderItem.setCaseSize(testWatch.getCaseSize());
        orderItem.setQuantity(1);
        orderItem.setUnitPrice(testWatch.getPrice());
        orderItem.setTotalPrice(testWatch.getPrice());
        orderItemRepository.save(orderItem);
        testOrder.setItems(List.of(orderItem));

        // 4. Issue Certificate & Record Provenance
        testCertificate = certificateService.issueCertificate(testOrder, testWatch, collectorUser, testOrder.getCertificateNumber());
        testProvenance = provenanceService.recordAcquisition(testOrder, testWatch, collectorUser, testCertificate, testOrder.getTotalAmount());
    }

    @Test
    @DisplayName("GET /provenance/my-vault - Should return collector's timepieces with nested certificate & services")
    void getMyVault_Success() throws Exception {
        mockMvc.perform(get("/provenance/my-vault")
                        .header("Authorization", "Bearer " + collectorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].watchId", is(testWatch.getId())))
                .andExpect(jsonPath("$.data[0].watchBrand", is("AUREN")))
                .andExpect(jsonPath("$.data[0].certificate.certificateNumber", is("CERT-CHRONO-991122")))
                .andExpect(jsonPath("$.data[0].serviceRecords", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /provenance/certificate/{certificateNumber} - Should return full certificate specification")
    void getCertificateByNumber_Success() throws Exception {
        mockMvc.perform(get("/provenance/certificate/CERT-CHRONO-991122")
                        .header("Authorization", "Bearer " + collectorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.certificateNumber", is("CERT-CHRONO-991122")))
                .andExpect(jsonPath("$.data.masterHorologist", is("Adrien de Beauharnais")))
                .andExpect(jsonPath("$.data.guillochePatternId", is("GUIL-ROSETTE-V1")))
                .andExpect(jsonPath("$.data.inscribedCollector", is("Duke of Wellington")));
    }

    @Test
    @DisplayName("GET /provenance/verify/{certificateNumber} - Public verification should return valid true for active cert")
    void verifyPublicCertificate_Valid() throws Exception {
        mockMvc.perform(get("/provenance/verify/CERT-CHRONO-991122"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isValid", is(true)))
                .andExpect(jsonPath("$.data.certificateNumber", is("CERT-CHRONO-991122")))
                .andExpect(jsonPath("$.data.watchBrand", is("AUREN")))
                .andExpect(jsonPath("$.data.status", is("ACTIVE")));
    }

    @Test
    @DisplayName("GET /provenance/verify/{certificateNumber} - Non-existent certificate should return isValid false")
    void verifyPublicCertificate_NotFound() throws Exception {
        mockMvc.perform(get("/provenance/verify/CERT-FAKE-000000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isValid", is(false)))
                .andExpect(jsonPath("$.data.status", is("INVALID_OR_NOT_FOUND")));
    }

    @Test
    @DisplayName("GET /provenance/watch/{watchId}/history - Publicly return chronological provenance ledger")
    void getWatchHistory_Success() throws Exception {
        mockMvc.perform(get("/provenance/watch/" + testWatch.getId() + "/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].watchId", is(testWatch.getId())))
                .andExpect(jsonPath("$.data[0].transferType", is("BOUTIQUE_ACQUISITION")));
    }

    @Test
    @DisplayName("POST /admin/provenance/service-record - Admin should append certified service record")
    void addServiceRecord_AdminSuccess() throws Exception {
        CreateServiceRecordRequest request = new CreateServiceRecordRequest(
                testProvenance.getId(),
                testWatch.getId(),
                ServiceType.FULL_CALIBER_OVERHAUL,
                "WRISTO Geneva Vault Atelier",
                "Adrien de Beauharnais",
                "5-Year Full Calibre Teardown & Lubrication. Mainspring replaced. Pressure tested to 100m.",
                "/assets/certificates/srv_doc_991122.pdf"
        );

        mockMvc.perform(post("/admin/provenance/service-record")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.serviceType", is("FULL_CALIBER_OVERHAUL")))
                .andExpect(jsonPath("$.data.serviceCenter", is("WRISTO Geneva Vault Atelier")))
                .andExpect(jsonPath("$.data.inspectionNotes", is(request.inspectionNotes())));
    }

    @Test
    @DisplayName("POST /admin/provenance/service-record - Customer should be denied with 403 Forbidden")
    void addServiceRecord_CustomerForbidden() throws Exception {
        CreateServiceRecordRequest request = new CreateServiceRecordRequest(
                testProvenance.getId(),
                testWatch.getId(),
                ServiceType.FULL_CALIBER_OVERHAUL,
                "WRISTO Geneva Vault Atelier",
                "Adrien de Beauharnais",
                "Unauthorized note",
                null
        );

        mockMvc.perform(post("/admin/provenance/service-record")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
