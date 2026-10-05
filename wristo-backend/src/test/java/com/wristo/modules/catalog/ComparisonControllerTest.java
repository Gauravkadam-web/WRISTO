package com.wristo.modules.catalog;

import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.entity.WatchSpec;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ComparisonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

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

        Brand auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        brandRepository.save(auren);

        Category men = new Category("cat-men", "men", "Men's Watches", "Men", "Masculine luxury", "male", 1, true);
        categoryRepository.save(men);

        for (int i = 1; i <= 5; i++) {
            Watch watch = new Watch();
            watch.setId("WRT-00" + i);
            watch.setNum("0" + i);
            watch.setBrand(auren);
            watch.setBrandName("AUREN");
            watch.setModel("Timepiece " + i);
            watch.setPrice(BigDecimal.valueOf(5000.00 + (i * 1000)));
            watch.setOriginalPrice(BigDecimal.valueOf(6500.00 + (i * 1000)));
            watch.setRating(BigDecimal.valueOf(4.8));
            watch.setReviewsCount(100 + i);
            watch.setImageUrl("/assets/products/watch-0" + i + ".png");
            watch.setCategory(men);
            watch.setCategoryName("Men");
            watch.setGender("Men");
            watch.setMovement("Automatic");
            watch.setStyle("Luxury");
            watch.setCaseSize("41mm");
            watch.setStrap("Leather");
            watch.setDial("Black");
            watch.setMaterial("316L Stainless Steel");
            watch.setWaterResistance("100m");
            watch.setStockCount(10);
            watch.setTagline("Luxury Timepiece " + i);
            watch.setDescription("Obsidian precision description " + i);
            watch.setIsActive(true);

            WatchSpec spec = new WatchSpec();
            spec.setWatch(watch);
            spec.setCaseDiameterMm("41mm");
            spec.setCaseMaterial("316L Stainless Steel");
            spec.setDialFinish("Sunburst Obsidian");
            spec.setStrapMaterial("Alligator Leather");
            spec.setWaterResistanceAtm("10 ATM / 100m");
            spec.setPowerReserveHours("70 Hours");
            spec.setGlassCrystal("Sapphire with AR Coating");
            spec.setClaspType("Deployant Clasp");
            spec.setWarrantyPeriod("5-Year Manufacture Warranty");
            watch.setSpecs(spec);

            watchRepository.save(watch);
        }
    }

    @Test
    void shouldReturnComparisonMatrixForValidWatches() throws Exception {
        mockMvc.perform(get("/compare")
                        .param("ids", "WRT-001,WRT-002,WRT-003")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.watches.length()").value(3))
                .andExpect(jsonPath("$.data.watches[0].id").value("WRT-001"))
                .andExpect(jsonPath("$.data.watches[1].id").value("WRT-002"))
                .andExpect(jsonPath("$.data.watches[2].id").value("WRT-003"))
                .andExpect(jsonPath("$.data.specs.length()").value(9))
                .andExpect(jsonPath("$.data.specs[0].label").value("Movement & Caliber"))
                .andExpect(jsonPath("$.data.specs[0].values['WRT-001']").value("Automatic"));
    }

    @Test
    void shouldRejectComparisonWithFewerThanTwoWatches() throws Exception {
        mockMvc.perform(get("/compare")
                        .param("ids", "WRT-001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("COMPARE_MIN_LIMIT"));
    }

    @Test
    void shouldRejectComparisonWithMoreThanFourWatches() throws Exception {
        mockMvc.perform(get("/compare")
                        .param("ids", "WRT-001,WRT-002,WRT-003,WRT-004,WRT-005")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("COMPARE_MAX_LIMIT"));
    }

    @Test
    void shouldReturn404WhenWatchInComparisonNotFound() throws Exception {
        mockMvc.perform(get("/compare")
                        .param("ids", "WRT-001,NON_EXISTENT_WATCH")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("WATCH_NOT_FOUND"));
    }
}
