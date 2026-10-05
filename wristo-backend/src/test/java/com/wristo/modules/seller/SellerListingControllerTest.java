package com.wristo.modules.seller;

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
import com.wristo.modules.seller.dto.CreateSellerListingRequest;
import com.wristo.modules.seller.dto.UpdateSellerListingRequest;
import com.wristo.modules.seller.entity.*;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.modules.seller.repository.SellerUserRepository;
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
class SellerListingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerUserRepository sellerUserRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private SellerBrandAuthorizationRepository brandAuthRepository;

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User sellerUser;
    private String sellerToken;
    private Seller seller;
    private Watch watch;

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
        sellerUserRepository.deleteAll();
        brandAuthRepository.deleteAll();
        sellerRepository.deleteAll();
        userRepository.deleteAll();
        watchRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();

        Brand auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        brandRepository.save(auren);

        Category men = new Category("cat-men", "men", "Men's Watches", "Men", "Masculine luxury", "male", 1, true);
        categoryRepository.save(men);

        watch = new Watch();
        watch.setId("WRT-001");
        watch.setNum("01");
        watch.setBrand(auren);
        watch.setBrandName("AUREN");
        watch.setModel("Atlas Black");
        watch.setPrice(BigDecimal.valueOf(4999.00));
        watch.setOriginalPrice(BigDecimal.valueOf(6499.00));
        watch.setRating(BigDecimal.valueOf(4.8));
        watch.setReviewsCount(142);
        watch.setImageUrl("/assets/products/watch-01.png");
        watch.setCategory(men);
        watch.setCategoryName("Men");
        watch.setGender("Men");
        watch.setMovement("Quartz");
        watch.setStyle("Minimal");
        watch.setCaseSize("40mm");
        watch.setStrap("Black Leather");
        watch.setDial("Matte Black");
        watch.setMaterial("Stainless Steel");
        watch.setWaterResistance("50m");
        watch.setBadge("Best Seller");
        watch.setTagline("Minimal precision.");
        watch.setDescription("Obsidian black minimalism.");
        watch.setAiMatchScore(98);
        watch.setStockCount(15);
        watch.setIsActive(true);
        watchRepository.save(watch);

        sellerUser = new User();
        sellerUser.setEmail("seller.auren@wristo.com");
        sellerUser.setPasswordHash(passwordEncoder.encode("Password@123"));
        sellerUser.setFullName("Auren Seller Owner");
        sellerUser.setRole("SELLER");
        sellerUser.setIsVerified(true);
        sellerUser.setIsActive(true);
        sellerUser = userRepository.save(sellerUser);

        sellerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(sellerUser));

        seller = new Seller("seller-auren-in", "AUREN Boutique", "Auren India Pvt Ltd", "27AABCA1234F1Z5", "AABCA1234F", "1234567890", "HDFC0001234");
        seller.setStatus(SellerStatus.VERIFIED);
        seller.setIsActive(true);
        seller = sellerRepository.save(seller);

        SellerUser su = new SellerUser();
        su.setSeller(seller);
        su.setUser(sellerUser);
        su.setRole(SellerStaffRole.OWNER);
        su.setIsPrimary(true);
        sellerUserRepository.save(su);
    }

    @Test
    void shouldCreateSellerListingWithInventory() throws Exception {
        CreateSellerListingRequest request = new CreateSellerListingRequest();
        request.setWatchId("WRT-001");
        request.setSellerSku("SKU-AUR-ATL-001");
        request.setPrice(BigDecimal.valueOf(4799.00));
        request.setOriginalPrice(BigDecimal.valueOf(6499.00));
        request.setCondition("NEW");
        request.setWarrantyType("BRAND_WARRANTY");
        request.setInitialStock(20);

        mockMvc.perform(post("/seller/listings")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sellerSku").value("SKU-AUR-ATL-001"))
                .andExpect(jsonPath("$.data.price").value(4799.00))
                .andExpect(jsonPath("$.data.availableQuantity").value(20));
    }

    @Test
    void shouldRejectDuplicateSkuForSameSeller() throws Exception {
        CreateSellerListingRequest request = new CreateSellerListingRequest();
        request.setWatchId("WRT-001");
        request.setSellerSku("SKU-AUR-DUP-001");
        request.setPrice(BigDecimal.valueOf(4799.00));
        request.setOriginalPrice(BigDecimal.valueOf(6499.00));
        request.setInitialStock(10);

        mockMvc.perform(post("/seller/listings")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Duplicate SKU request
        mockMvc.perform(post("/seller/listings")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("SELLER_LISTING_ALREADY_EXISTS"));
    }

    @Test
    void shouldGetBoutiqueListings() throws Exception {
        SellerListing listing = new SellerListing();
        listing.setSeller(seller);
        listing.setWatch(watch);
        listing.setSellerSku("SKU-GET-001");
        listing.setPrice(BigDecimal.valueOf(4800.00));
        listing.setOriginalPrice(BigDecimal.valueOf(6499.00));
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setIsActive(true);
        sellerListingRepository.save(listing);

        mockMvc.perform(get("/seller/listings")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.items[0].sellerSku").value("SKU-GET-001"));
    }

    @Test
    void shouldUpdateSellerListing() throws Exception {
        SellerListing listing = new SellerListing();
        listing.setSeller(seller);
        listing.setWatch(watch);
        listing.setSellerSku("SKU-UPD-001");
        listing.setPrice(BigDecimal.valueOf(4800.00));
        listing.setOriginalPrice(BigDecimal.valueOf(6499.00));
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setIsActive(true);
        listing = sellerListingRepository.save(listing);

        UpdateSellerListingRequest update = new UpdateSellerListingRequest();
        update.setPrice(BigDecimal.valueOf(4599.00));
        update.setOriginalPrice(BigDecimal.valueOf(6499.00));
        update.setCondition("MINT_PREOWNED");

        mockMvc.perform(put("/seller/listings/" + listing.getId())
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.price").value(4599.00))
                .andExpect(jsonPath("$.data.condition").value("MINT_PREOWNED"));
    }
}
