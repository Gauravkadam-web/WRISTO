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
import com.wristo.modules.seller.dto.AdminListingApprovalRequest;
import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerListing;
import com.wristo.modules.seller.entity.SellerStatus;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminListingControllerTest {

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

    private User adminUser;
    private String adminToken;
    private Seller seller;
    private Watch watch;
    private SellerListing pendingListing;

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
        watch.setTagline("Minimal precision.");
        watch.setDescription("Obsidian black minimalism.");
        watch.setIsActive(true);
        watchRepository.save(watch);

        seller = new Seller("seller-auren-in", "AUREN Boutique", "Auren India Pvt Ltd", "27AABCA1234F1Z5", "AABCA1234F", "1234567890", "HDFC0001234");
        seller.setStatus(SellerStatus.VERIFIED);
        seller.setIsActive(true);
        seller = sellerRepository.save(seller);

        adminUser = new User();
        adminUser.setEmail("admin@wristo.com");
        adminUser.setPasswordHash(passwordEncoder.encode("Password@123"));
        adminUser.setFullName("Super Admin");
        adminUser.setRole("ADMIN");
        adminUser.setIsVerified(true);
        adminUser.setIsActive(true);
        adminUser = userRepository.save(adminUser);

        adminToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(adminUser));

        pendingListing = new SellerListing();
        pendingListing.setSeller(seller);
        pendingListing.setWatch(watch);
        pendingListing.setSellerSku("SKU-PENDING-001");
        pendingListing.setPrice(BigDecimal.valueOf(4900.00));
        pendingListing.setOriginalPrice(BigDecimal.valueOf(6499.00));
        pendingListing.setStatus(ListingStatus.PENDING_APPROVAL);
        pendingListing.setIsActive(false);
        pendingListing = sellerListingRepository.save(pendingListing);
    }

    @Test
    void shouldGetAllListings() throws Exception {
        mockMvc.perform(get("/admin/listings")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void shouldApproveSellerListing() throws Exception {
        mockMvc.perform(put("/admin/listings/" + pendingListing.getId() + "/approve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.isActive").value(true));
    }

    @Test
    void shouldRejectSellerListingWithReason() throws Exception {
        AdminListingApprovalRequest rejectReq = new AdminListingApprovalRequest();
        rejectReq.setApproved(false);
        rejectReq.setRejectionReason("Pricing violates minimum advertised pricing policy.");

        mockMvc.perform(put("/admin/listings/" + pendingListing.getId() + "/reject")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("REJECTED"))
                .andExpect(jsonPath("$.data.rejectionReason").value("Pricing violates minimum advertised pricing policy."));
    }
}
