package com.wristo.modules.catalog;

import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.entity.WatchSpec;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
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
import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.coupon.repository.CouponRepository;
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
class CatalogControllerTest {

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
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SellerBrandAuthorizationRepository brandAuthorizationRepository;

    private Watch watch1;
    private Watch watch2;
    private Brand auren;
    private Category men;

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

        auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        brandRepository.save(auren);

        men = new Category("cat-men", "men", "Men's Watches", "Men", "Masculine luxury", "male", 1, true);
        categoryRepository.save(men);

        watch1 = new Watch();
        watch1.setId("WRT-001");
        watch1.setNum("01");
        watch1.setBrand(auren);
        watch1.setBrandName("AUREN");
        watch1.setModel("Atlas Black");
        watch1.setPrice(BigDecimal.valueOf(4999.00));
        watch1.setOriginalPrice(BigDecimal.valueOf(6499.00));
        watch1.setRating(BigDecimal.valueOf(4.8));
        watch1.setReviewsCount(142);
        watch1.setImageUrl("/assets/products/watch-01.png");
        watch1.setCategory(men);
        watch1.setCategoryName("Men");
        watch1.setGender("Men");
        watch1.setMovement("Quartz");
        watch1.setStyle("Minimal");
        watch1.setCaseSize("40mm");
        watch1.setStrap("Black Leather");
        watch1.setDial("Matte Black");
        watch1.setMaterial("Stainless Steel");
        watch1.setWaterResistance("50m");
        watch1.setBadge("Best Seller");
        watch1.setTagline("Minimal precision.");
        watch1.setDescription("Obsidian black minimalism.");
        watch1.setAiMatchScore(98);
        watch1.setAiReason("Obsidian tone.");
        watch1.setStockCount(15);
        watch1.setIsActive(true);

        WatchSpec spec1 = new WatchSpec();
        spec1.setWatch(watch1);
        spec1.setCaseDiameterMm("40mm");
        spec1.setCaseMaterial("316L Stainless Steel");
        spec1.setDialFinish("Matte Obsidian");
        spec1.setStrapMaterial("Italian Calfskin");
        spec1.setWaterResistanceAtm("50m");
        spec1.setPowerReserveHours("3-Year Battery");
        spec1.setGlassCrystal("Hardened Mineral Crystal");
        spec1.setClaspType("Engraved Tang Buckle");
        spec1.setWarrantyPeriod("2-Year International Warranty");
        watch1.setSpecs(spec1);

        watchRepository.save(watch1);

        watch2 = new Watch();
        watch2.setId("WRT-002");
        watch2.setNum("02");
        watch2.setBrand(auren);
        watch2.setBrandName("AUREN");
        watch2.setModel("Meridian Silver");
        watch2.setPrice(BigDecimal.valueOf(5499.00));
        watch2.setOriginalPrice(BigDecimal.valueOf(6999.00));
        watch2.setRating(BigDecimal.valueOf(4.7));
        watch2.setReviewsCount(98);
        watch2.setImageUrl("/assets/products/watch-02.png");
        watch2.setCategory(men);
        watch2.setCategoryName("Men");
        watch2.setGender("Men");
        watch2.setMovement("Quartz");
        watch2.setStyle("Classic");
        watch2.setCaseSize("41mm");
        watch2.setStrap("Silver Mesh");
        watch2.setDial("Sunray Silver");
        watch2.setMaterial("Stainless Steel");
        watch2.setWaterResistance("50m");
        watch2.setBadge("Trending");
        watch2.setTagline("Fluid Milanese elegance.");
        watch2.setDescription("Sunray silver dial with mesh strap.");
        watch2.setAiMatchScore(94);
        watch2.setStockCount(15);
        watch2.setIsActive(true);

        watchRepository.save(watch2);
    }

    @Test
    void shouldReturnFilteredWatchesWithFacets() throws Exception {
        mockMvc.perform(get("/watches")
                        .param("brand", "AUREN")
                        .param("movement", "Quartz")
                        .param("page", "1")
                        .param("limit", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.total").value(2))
                .andExpect(jsonPath("$.data.products[0].id").value("WRT-001"))
                .andExpect(jsonPath("$.data.products[0].brand").value("AUREN"))
                .andExpect(jsonPath("$.data.facets.brands[0].name").value("AUREN"))
                .andExpect(jsonPath("$.data.facets.movements[0].name").value("Quartz"))
                .andExpect(jsonPath("$.data.facets.priceRange.min").value(4999.00));
    }

    @Test
    void shouldReturnWatchDetailsWithSpecs() throws Exception {
        mockMvc.perform(get("/watches/WRT-001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("WRT-001"))
                .andExpect(jsonPath("$.data.model").value("Atlas Black"))
                .andExpect(jsonPath("$.data.specs.caseDiameterMm").value("40mm"))
                .andExpect(jsonPath("$.data.specs.glassCrystal").value("Hardened Mineral Crystal"));
    }

    @Test
    void shouldReturnSimilarWatches() throws Exception {
        mockMvc.perform(get("/watches/WRT-001/similar")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("WRT-002"));
    }

    @Test
    void shouldReturnActiveOffersForWatch() throws Exception {
        Seller seller = new Seller("seller-auren-in", "AUREN Boutique", "Auren India Pvt Ltd", "27AABCA1234F1Z5", "AABCA1234F", "1234567890", "HDFC0001234");
        seller.setStatus(SellerStatus.VERIFIED);
        seller.setIsActive(true);
        sellerRepository.save(seller);

        SellerListing listing = new SellerListing();
        listing.setSeller(seller);
        listing.setWatch(watch1);
        listing.setSellerSku("SKU-AUR-001");
        listing.setPrice(BigDecimal.valueOf(4899.00));
        listing.setOriginalPrice(BigDecimal.valueOf(6499.00));
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setIsActive(true);
        sellerListingRepository.save(listing);

        mockMvc.perform(get("/watches/WRT-001/listings")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].sellerSku").value("SKU-AUR-001"))
                .andExpect(jsonPath("$.data[0].price").value(4899.00));
    }

    @Test
    void shouldReturnBrandsList() throws Exception {
        mockMvc.perform(get("/brands")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("AUREN"))
                .andExpect(jsonPath("$.data[0].country").value("Switzerland"));
    }

    @Test
    void shouldReturnCategoriesList() throws Exception {
        mockMvc.perform(get("/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].slug").value("men"))
                .andExpect(jsonPath("$.data[0].title").value("Men's Watches"));
    }

    @Test
    void shouldReturn404ForNonExistentWatch() throws Exception {
        mockMvc.perform(get("/watches/NON_EXISTENT_ID")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("WATCH_NOT_FOUND"));
    }
}
