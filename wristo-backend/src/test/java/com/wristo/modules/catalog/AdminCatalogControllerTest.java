package com.wristo.modules.catalog;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.catalog.dto.CreateWatchRequest;
import com.wristo.modules.catalog.dto.UpdateWatchRequest;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.entity.WatchSpec;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.catalog.repository.WatchSpecRepository;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.repository.PaymentRepository;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.modules.seller.repository.SellerUserRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminCatalogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private WatchSpecRepository watchSpecRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SellerUserRepository sellerUserRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private SellerBrandAuthorizationRepository brandAuthorizationRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private com.wristo.modules.checkout.repository.CheckoutSessionRepository checkoutSessionRepository;

    @Autowired
    private com.wristo.modules.cart.repository.CartItemRepository cartItemRepository;

    @Autowired
    private com.wristo.modules.cart.repository.CartRepository cartRepository;

    @Autowired
    private com.wristo.modules.wishlist.repository.WishlistItemRepository wishlistItemRepository;

    @Autowired
    private com.wristo.modules.wishlist.repository.WishlistRepository wishlistRepository;

    @Autowired
    private com.wristo.modules.coupon.repository.CouponRepository couponRepository;

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
    private Brand patekBrand;
    private Category grandComplications;
    private Watch existingWatch;

    @BeforeEach
    void setUp() {
        checkoutSessionRepository.deleteAll();
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
        watchSpecRepository.deleteAll();
        watchRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = new User("curator@wristo.luxury", passwordEncoder.encode("Curator@123"), "Master Curator", "+919999988888", "ADMIN");
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(adminUser));

        patekBrand = new Brand("brand-patek", "Patek Philippe", "Switzerland", 1839, "Geneva Seal", "Geneva seal horology", "/assets/brands/patek.png", true);
        patekBrand = brandRepository.save(patekBrand);

        grandComplications = new Category("cat-grand-complications", "grand-complications", "Grand Complications", "Complications", "Horological masterworks", "clock", 1, true);
        grandComplications = categoryRepository.save(grandComplications);

        existingWatch = new Watch();
        existingWatch.setId("patek-5270p");
        existingWatch.setNum("01");
        existingWatch.setBrand(patekBrand);
        existingWatch.setBrandName("Patek Philippe");
        existingWatch.setModel("Grand Complications 5270P");
        existingWatch.setPrice(new BigDecimal("18500000.00"));
        existingWatch.setOriginalPrice(new BigDecimal("21000000.00"));
        existingWatch.setRating(BigDecimal.valueOf(5.0));
        existingWatch.setReviewsCount(18);
        existingWatch.setImageUrl("/assets/products/patek-5270p.png");
        existingWatch.setCategory(grandComplications);
        existingWatch.setCategoryName("Grand Complications");
        existingWatch.setGender("Men");
        existingWatch.setMovement("Manual Wind CH 29-535 PS Q");
        existingWatch.setStyle("Grand Complication");
        existingWatch.setCaseSize("41mm");
        existingWatch.setStrap("Alligator Leather");
        existingWatch.setDial("Salmon Opaline");
        existingWatch.setMaterial("Platinum 950");
        existingWatch.setWaterResistance("30m");
        existingWatch.setBadge("VAULT MASTERPIECE");
        existingWatch.setTagline("Perpetual Calendar Chronograph in Platinum.");
        existingWatch.setDescription("The quintessential grand complication with salmon opaline dial and platinum case.");
        existingWatch.setAiMatchScore(99);
        existingWatch.setAiReason("Ultimate investment-grade collector watch.");
        existingWatch.setStockCount(3);
        existingWatch.setIsActive(true);
        existingWatch = watchRepository.save(existingWatch);

        WatchSpec spec = new WatchSpec();
        spec.setWatch(existingWatch);
        spec.setCaseDiameterMm("41mm");
        spec.setCaseMaterial("Platinum 950");
        spec.setDialFinish("Salmon Opaline");
        spec.setStrapMaterial("Alligator");
        spec.setPowerReserveHours("65 Hours");
        spec.setWaterResistanceAtm("3 ATM");
        spec.setWarrantyPeriod("5-Year Manufacturer");
        watchSpecRepository.save(spec);
    }

    @Test
    void getAllWatches_asAdmin_shouldReturnPagedCatalog() throws Exception {
        mockMvc.perform(get("/admin/watches")
                        .header("Authorization", "Bearer " + adminToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items[0].id").value("patek-5270p"))
                .andExpect(jsonPath("$.data.items[0].brand").value("Patek Philippe"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void getAllWatches_unauthorized_shouldReturnForbiddenOrUnauthorized() throws Exception {
        mockMvc.perform(get("/admin/watches")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getWatchById_asAdmin_shouldReturnWatchDetails() throws Exception {
        mockMvc.perform(get("/admin/watches/patek-5270p")
                        .header("Authorization", "Bearer " + adminToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("patek-5270p"))
                .andExpect(jsonPath("$.data.model").value("Grand Complications 5270P"))
                .andExpect(jsonPath("$.data.specs.powerReserveHours").value("65 Hours"));
    }

    @Test
    void createWatch_asAdmin_shouldCreateAndReturn201() throws Exception {
        CreateWatchRequest request = new CreateWatchRequest();
        request.setId("rolex-daytona-126500ln");
        request.setNum("41");
        request.setBrandName("Rolex");
        request.setModel("Cosmograph Daytona");
        request.setPrice(new BigDecimal("2800000.00"));
        request.setCategoryName("Sport Chronograph");
        request.setMovement("Calibre 4131 Automatic");
        request.setMaterial("Oystersteel");
        request.setCaseDiameterMm("40.0mm");
        request.setCaseMaterial("Oystersteel 904L");
        request.setPowerReserveHours("72 Hours");
        request.setWaterResistanceAtm("10 ATM");

        mockMvc.perform(post("/admin/watches")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("ROLEX-DAYTONA-126500LN"))
                .andExpect(jsonPath("$.data.brand").value("Rolex"))
                .andExpect(jsonPath("$.data.model").value("Cosmograph Daytona"));
    }

    @Test
    void updateWatch_asAdmin_shouldUpdateAndReturn200() throws Exception {
        UpdateWatchRequest request = new UpdateWatchRequest();
        request.setModel("Grand Complications 5270P - Salmon Dial Updated");
        request.setPrice(new BigDecimal("19200000.00"));
        request.setPowerReserveHours("68 Hours");

        mockMvc.perform(put("/admin/watches/patek-5270p")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.model").value("Grand Complications 5270P - Salmon Dial Updated"))
                .andExpect(jsonPath("$.data.price").value(19200000.00));
    }

    @Test
    void deleteWatch_asAdmin_shouldSoftDeleteWatch() throws Exception {
        mockMvc.perform(delete("/admin/watches/patek-5270p")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/admin/watches/patek-5270p")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isActive").value(false));
    }

    @Test
    void toggleWatchStatus_asAdmin_shouldToggleActiveStatus() throws Exception {
        mockMvc.perform(patch("/admin/watches/patek-5270p/toggle-status")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isActive").value(false));
    }
}
