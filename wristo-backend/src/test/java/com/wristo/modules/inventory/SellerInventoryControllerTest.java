package com.wristo.modules.inventory;

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
import com.wristo.modules.inventory.dto.AdjustStockRequest;
import com.wristo.modules.inventory.dto.StockReservationResponse;
import com.wristo.modules.inventory.entity.Inventory;
import com.wristo.modules.inventory.entity.ReservationStatus;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.inventory.service.InventoryService;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SellerInventoryControllerTest {

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

    @Autowired
    private InventoryService inventoryService;

    private User sellerUser;
    private String sellerToken;
    private Seller seller;
    private Watch watch;
    private SellerListing listing;
    private Inventory inventory;

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

        listing = new SellerListing();
        listing.setSeller(seller);
        listing.setWatch(watch);
        listing.setSellerSku("SKU-INV-001");
        listing.setPrice(BigDecimal.valueOf(4800.00));
        listing.setOriginalPrice(BigDecimal.valueOf(6499.00));
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setIsActive(true);
        listing = sellerListingRepository.save(listing);

        inventory = new Inventory();
        inventory.setSellerListing(listing);
        inventory.setTotalQuantity(20);
        inventory.setAvailableQuantity(20);
        inventory.setReservedQuantity(0);
        inventory.setSoldQuantity(0);
        inventory.setLowStockThreshold(3);
        inventory = inventoryRepository.save(inventory);

        listing.setInventory(inventory);
    }

    @Test
    void shouldGetSellerInventory() throws Exception {
        mockMvc.perform(get("/seller/inventory")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.items[0].sellerSku").value("SKU-INV-001"))
                .andExpect(jsonPath("$.data.items[0].availableQuantity").value(20));
    }

    @Test
    void shouldAdjustInventoryStockAndLogMovement() throws Exception {
        AdjustStockRequest adjust = new AdjustStockRequest();
        adjust.setSellerListingId(listing.getId());
        adjust.setQuantityChange(10);
        adjust.setReason("Inbound shipment PO-2026-99 received");

        mockMvc.perform(post("/seller/inventory/adjust")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adjust)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.availableQuantity").value(30))
                .andExpect(jsonPath("$.data.totalQuantity").value(30));

        // Verify movement audit log endpoint
        mockMvc.perform(get("/seller/inventory/listings/" + listing.getId() + "/movements")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.items[0].movementType").value("RESTOCK"))
                .andExpect(jsonPath("$.data.items[0].quantity").value(10))
                .andExpect(jsonPath("$.data.items[0].reason").value("Inbound shipment PO-2026-99 received"));
    }

    @Test
    void shouldRejectNegativeStockAdjustment() throws Exception {
        AdjustStockRequest adjust = new AdjustStockRequest();
        adjust.setSellerListingId(listing.getId());
        adjust.setQuantityChange(-50); // available is only 20
        adjust.setReason("Damaged inventory scrap");

        mockMvc.perform(post("/seller/inventory/adjust")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adjust)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("INVALID_INVENTORY_ADJUSTMENT"));
    }

    @Test
    void shouldReserveStockAndCompleteReservation() {
        StockReservationResponse res = inventoryService.reserveStock(listing.getId(), sellerUser.getId(), 2, 15);
        assertThat(res).isNotNull();
        assertThat(res.getStatus()).isEqualTo(ReservationStatus.ACTIVE);
        assertThat(res.getQuantity()).isEqualTo(2);

        Inventory invAfterReserve = inventoryRepository.findBySellerListingId(listing.getId()).orElseThrow();
        assertThat(invAfterReserve.getAvailableQuantity()).isEqualTo(18);
        assertThat(invAfterReserve.getReservedQuantity()).isEqualTo(2);

        // Complete reservation upon order placement
        inventoryService.completeReservation(res.getReservationId(), "ORD-2026-TEST");

        Inventory invAfterComplete = inventoryRepository.findBySellerListingId(listing.getId()).orElseThrow();
        assertThat(invAfterComplete.getAvailableQuantity()).isEqualTo(18);
        assertThat(invAfterComplete.getReservedQuantity()).isEqualTo(0);
        assertThat(invAfterComplete.getSoldQuantity()).isEqualTo(2);
    }
}
