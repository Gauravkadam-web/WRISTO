package com.wristo.modules.wishlist;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.coupon.repository.CouponRepository;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.modules.wishlist.repository.WishlistItemRepository;
import com.wristo.modules.wishlist.repository.WishlistRepository;
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
class WishlistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

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

    private User collectorUser;
    private String collectorToken;
    private Watch watch1;
    private Watch watch2;

    @BeforeEach
    void setUp() {
        wishlistItemRepository.deleteAll();
        wishlistRepository.deleteAll();
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

        collectorUser = new User("vault.collector@wristo.luxury", passwordEncoder.encode("Pass@123"), "Lord Harrison", "+442079460912", "CUSTOMER");
        collectorUser = userRepository.save(collectorUser);
        collectorToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(collectorUser));

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
        watch1.setRating(BigDecimal.valueOf(4.8));
        watch1.setReviewsCount(100);
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
        watch2.setRating(BigDecimal.valueOf(4.9));
        watch2.setReviewsCount(120);
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
    }

    @Test
    void shouldToggleWatchInWishlist() throws Exception {
        // Toggle on (add)
        mockMvc.perform(post("/wishlist/toggle/WRT-001")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.watchId").value("WRT-001"))
                .andExpect(jsonPath("$.data.inWishlist").value(true))
                .andExpect(jsonPath("$.data.added").value(true));

        // Check if in wishlist
        mockMvc.perform(get("/wishlist/check/WRT-001")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(true));

        // Toggle off (remove)
        mockMvc.perform(post("/wishlist/toggle/WRT-001")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.inWishlist").value(false))
                .andExpect(jsonPath("$.data.added").value(false));
    }

    @Test
    void shouldAddRemoveAndFetchWishlist() throws Exception {
        mockMvc.perform(post("/wishlist/items/WRT-001")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItems").value(1));

        mockMvc.perform(post("/wishlist/items/WRT-002")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItems").value(2));

        mockMvc.perform(get("/wishlist")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(2));

        mockMvc.perform(delete("/wishlist/items/WRT-001")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItems").value(1));
    }

    @Test
    void shouldMoveWishlistItemToCart() throws Exception {
        mockMvc.perform(post("/wishlist/items/WRT-001")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(post("/wishlist/items/WRT-001/move-to-cart")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItems").value(1));

        // Verify it was added to the user's cart and removed from wishlist
        mockMvc.perform(get("/cart")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].watchId").value("WRT-001"));

        mockMvc.perform(get("/wishlist")
                        .header("Authorization", "Bearer " + collectorToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalItems").value(0));
    }

    @Test
    void shouldRejectUnauthenticatedWishlistAccess() throws Exception {
        mockMvc.perform(get("/wishlist")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
