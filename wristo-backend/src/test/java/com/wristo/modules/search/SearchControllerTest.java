package com.wristo.modules.search;

import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        Brand titan = brandRepository.findByNameIgnoreCase("Titan")
                .orElseGet(() -> brandRepository.save(new Brand("brand-titan", "Titan", "India", 1984, "Indian Craftsmanship", "Iconic watches", "/assets/brands/titan.png", true)));

        Brand auren = brandRepository.findByNameIgnoreCase("AUREN")
                .orElseGet(() -> brandRepository.save(new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Swiss Precision", "Haute horology", "/assets/brands/auren.png", true)));

        Category cat = categoryRepository.findBySlugIgnoreCase("men")
                .orElseGet(() -> categoryRepository.findById("cat-test")
                        .orElseGet(() -> categoryRepository.save(new Category("cat-test", "men-search", "Men's Luxury", "Men", "Luxury timepieces", "male", 1, true))));

        if (watchRepository.findById("WRT-SEARCH-01").isEmpty()) {
            Watch w1 = new Watch();
            w1.setId("WRT-SEARCH-01");
            w1.setNum("01");
            w1.setBrand(titan);
            w1.setBrandName("Titan");
            w1.setModel("Titan Edge Automatic");
            w1.setPrice(BigDecimal.valueOf(14999));
            w1.setOriginalPrice(BigDecimal.valueOf(18999));
            w1.setRating(BigDecimal.valueOf(4.9));
            w1.setReviewsCount(80);
            w1.setImageUrl("/assets/watches/watch-01.png");
            w1.setCategory(cat);
            w1.setCategoryName("Men");
            w1.setGender("Men");
            w1.setMovement("Automatic");
            w1.setStyle("Dress");
            w1.setCaseSize("39mm");
            w1.setStrap("Leather");
            w1.setDial("Obsidian");
            w1.setMaterial("Surgical 316L Steel");
            w1.setWaterResistance("50m");
            w1.setTagline("Ultra-thin elegance");
            w1.setDescription("Precision automatic sweep movement designed for formal gala evenings.");
            w1.setIsActive(true);
            watchRepository.save(w1);
        }
    }

    @Test
    @DisplayName("GET /search/autocomplete with matching prefix returns brands, watches and categories")
    void testAutocomplete_withValidQuery_returnsSuggestions() throws Exception {
        mockMvc.perform(get("/search/autocomplete")
                        .param("q", "titan")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.query").value("titan"))
                .andExpect(jsonPath("$.data.brands", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.totalMatches", greaterThan(0)));
    }

    @Test
    @DisplayName("GET /search/autocomplete with empty query returns empty results")
    void testAutocomplete_withEmptyQuery_returnsEmpty() throws Exception {
        mockMvc.perform(get("/search/autocomplete")
                        .param("q", "")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalMatches").value(0))
                .andExpect(jsonPath("$.data.watches", hasSize(0)));
    }

    @Test
    @DisplayName("GET /search/popular returns trending queries, brands and styles")
    void testGetPopularSearches_returnsTrendingLists() throws Exception {
        mockMvc.perform(get("/search/popular")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.popularSearches", hasItem("Chronograph")))
                .andExpect(jsonPath("$.data.trendingBrands", hasItem("AUREN")))
                .andExpect(jsonPath("$.data.trendingStyles", hasItem("Automatic")));
    }

    @Test
    @DisplayName("GET /search/query executes full-text search and aggregates facets")
    void testFullSearch_withQuery_returnsPaginatedResultsAndFacets() throws Exception {
        mockMvc.perform(get("/search/query")
                        .param("q", "automatic")
                        .param("page", "1")
                        .param("limit", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.query").value("automatic"))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data.movementFacets", notNullValue()));
    }
}
