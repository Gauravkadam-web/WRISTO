package com.wristo.modules.cart;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.dto.*;
import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.entity.DiscountType;
import com.wristo.modules.coupon.repository.CouponRepository;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerBrandAuthorizationRepository brandAuthorizationRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Watch watch1;
    private Watch watch2;
    private SellerListing listing1;
    private User customerUser;
    private String customerToken;
    private final String sessionId = UUID.randomUUID().toString();

    @BeforeEach
    void setUp() {
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        couponRepository.deleteAll();
        inventoryMovementRepository.deleteAll();
        inventoryReservationRepository.deleteAll();
        inventoryRepository.deleteAll();
        sellerListingRepository.deleteAll();
        brandAuthorizationRepository.deleteAll();
        sellerRepository.deleteAll();
        watchRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        customerUser = new User("cart.collector@wristo.luxury", passwordEncoder.encode("Pass@123"), "Lord Harrison", "+442079460912", "CUSTOMER");
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(customerUser));

        Brand auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        brandRepository.save(auren);

        Category men = new Category("cat-men", "men", "Men's Watches", "Men", "Masculine luxury", "male", 1, true);
        categoryRepository.save(men);

        watch1 = new Watch();
        watch1.setId("WRT-001");
        watch1.setNum("01");
        watch1.setBrand(auren);
        watch1.setBrandName("AUREN");
        watch1.setModel("Atlas Black");
        watch1.setPrice(BigDecimal.valueOf(5000.00));
        watch1.setOriginalPrice(BigDecimal.valueOf(6500.00));
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
        watchRepository.save(watch1);

        watch2 = new Watch();
        watch2.setId("WRT-002");
        watch2.setNum("02");
        watch2.setBrand(auren);
        watch2.setBrandName("AUREN");
        watch2.setModel("Meridian Silver");
        watch2.setPrice(BigDecimal.valueOf(8000.00));
        watch2.setOriginalPrice(BigDecimal.valueOf(9500.00));
        watch2.setImageUrl("/assets/products/watch-02.png");
        watch2.setCategory(men);
        watch2.setCategoryName("Men");
        watch2.setGender("Men");
        watch2.setMovement("Automatic");
        watch2.setStyle("Classic");
        watch2.setCaseSize("41mm");
        watch2.setStrap("Steel");
        watch2.setDial("Silver");
        watch2.setMaterial("Steel");
        watch2.setWaterResistance("50m");
        watch2.setTagline("Meridian Classic");
        watch2.setDescription("Silver Horizon");
        watch2.setStockCount(5);
        watch2.setIsActive(true);
        watchRepository.save(watch2);

        Seller seller = new Seller("seller-boutique", "AUREN Boutique London", "Auren UK Ltd", "GB123456789", "AURENUK", "1234567890", "BARC0001234");
        seller.setStatus(SellerStatus.VERIFIED);
        seller.setIsActive(true);
        sellerRepository.save(seller);

        listing1 = new SellerListing();
        listing1.setSeller(seller);
        listing1.setWatch(watch1);
        listing1.setSellerSku("SKU-AUR-LONDON-01");
        listing1.setPrice(BigDecimal.valueOf(4900.00));
        listing1.setOriginalPrice(BigDecimal.valueOf(6500.00));
        listing1.setStatus(ListingStatus.ACTIVE);
        listing1.setIsActive(true);
        sellerListingRepository.save(listing1);

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
    void shouldCreateGuestCartAndAddItem() throws Exception {
        AddToCartRequest addReq = new AddToCartRequest("WRT-001", 1);

        mockMvc.perform(post("/cart/items")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].watchId").value("WRT-001"))
                .andExpect(jsonPath("$.data.items[0].price").value(5000.00))
                .andExpect(jsonPath("$.data.totalItems").value(1))
                .andExpect(jsonPath("$.data.totals.subtotal").value(5000.00));

        mockMvc.perform(get("/cart")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(1));
    }

    @Test
    void shouldUpdateCartItemQuantityAndRecalculate() throws Exception {
        AddToCartRequest addReq = new AddToCartRequest("WRT-001", 1);

        MvcResult result = mockMvc.perform(post("/cart/items")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andReturn();

        String responseJson = result.getResponse().getContentAsString();
        String itemId = objectMapper.readTree(responseJson).path("data").path("items").get(0).path("id").asText();

        UpdateCartItemRequest updateReq = new UpdateCartItemRequest(2);
        mockMvc.perform(put("/cart/items/" + itemId)
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItems").value(2))
                .andExpect(jsonPath("$.data.totals.subtotal").value(10000.00));
    }

    @Test
    void shouldApplyCouponAndConfigureGiftAndDeliveryOptions() throws Exception {
        AddToCartRequest addReq = new AddToCartRequest("WRT-001", 1);
        mockMvc.perform(post("/cart/items")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk());

        ApplyCouponRequest couponReq = new ApplyCouponRequest("WRISTO10");
        mockMvc.perform(post("/cart/coupon")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(couponReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totals.appliedCoupon.code").value("WRISTO10"))
                .andExpect(jsonPath("$.data.totals.discount").value(500.00));

        CartGiftOptionRequest giftReq = new CartGiftOptionRequest(true, "For the Lord of Mayfair");
        mockMvc.perform(post("/cart/gift-options")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(giftReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isGiftWrapped").value(true))
                .andExpect(jsonPath("$.data.totals.giftWrapFee").value(500.00));

        CartDeliveryOptionRequest delReq = new CartDeliveryOptionRequest("EXPRESS");
        mockMvc.perform(post("/cart/delivery-options")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(delReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.deliveryTier").value("EXPRESS"))
                .andExpect(jsonPath("$.data.totals.shippingFee").value(1500.00));

        mockMvc.perform(delete("/cart/coupon")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totals.appliedCoupon").doesNotExist());
    }

    @Test
    void shouldRemoveCartItemAndClearCart() throws Exception {
        AddToCartRequest addReq = new AddToCartRequest("WRT-001", 1);
        MvcResult result = mockMvc.perform(post("/cart/items")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andReturn();

        String itemId = objectMapper.readTree(result.getResponse().getContentAsString()).path("data").path("items").get(0).path("id").asText();

        mockMvc.perform(delete("/cart/items/" + itemId)
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(0))
                .andExpect(jsonPath("$.data.totals.subtotal").value(0.00));

        mockMvc.perform(delete("/cart")
                        .header("X-Session-ID", sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void shouldSupportAuthenticatedCollectorCart() throws Exception {
        AddToCartRequest addReq = new AddToCartRequest("WRT-002", 1);

        mockMvc.perform(post("/cart/items")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items[0].watchId").value("WRT-002"))
                .andExpect(jsonPath("$.data.totals.subtotal").value(8000.00));

        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(1));
    }

    @Test
    void shouldPerformStatelessTotalsCalculation() throws Exception {
        CalculateTotalsRequest request = new CalculateTotalsRequest(
                List.of(
                        new CartItemInput("WRT-001", 1),
                        new CartItemInput("WRT-002", 1)
                ),
                "WRISTO10",
                "EXPRESS",
                true
        );

        mockMvc.perform(post("/cart/calculate-totals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.subtotal").value(13000.00))
                .andExpect(jsonPath("$.data.discount").value(1300.00))
                .andExpect(jsonPath("$.data.giftWrapFee").value(500.00))
                .andExpect(jsonPath("$.data.shippingFee").value(1500.00))
                .andExpect(jsonPath("$.data.taxAmount").value(2340.00))
                .andExpect(jsonPath("$.data.totalAmount").value(16040.00));
    }
}
