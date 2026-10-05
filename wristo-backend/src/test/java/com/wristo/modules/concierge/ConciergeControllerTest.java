package com.wristo.modules.concierge;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.concierge.dto.ChatMessageDto;
import com.wristo.modules.concierge.dto.ConciergeChatRequest;
import com.wristo.modules.concierge.dto.ConciergePreferencesRequest;
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
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ConciergeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        Brand auren = brandRepository.findByNameIgnoreCase("AUREN")
                .orElseGet(() -> brandRepository.save(new Brand("brand-auren-concierge", "AUREN", "Switzerland", 1928, "Swiss Precision", "Haute horology", "/assets/brands/auren.png", true)));

        Category cat = categoryRepository.findBySlugIgnoreCase("men")
                .orElseGet(() -> categoryRepository.findById("cat-concierge")
                        .orElseGet(() -> categoryRepository.save(new Category("cat-concierge", "men-concierge", "Men's Luxury", "Men", "Luxury timepieces", "male", 1, true))));

        createWatchIfNotExists("WRT-CONC-01", "Regent Green Automatic", "Automatic", "Dress", "40mm", BigDecimal.valueOf(14999), auren, cat);
        createWatchIfNotExists("WRT-CONC-02", "Atlas Chrono Obsidian", "Chronograph", "Sports", "42mm", BigDecimal.valueOf(12999), auren, cat);
        createWatchIfNotExists("WRT-CONC-03", "Heritage Skeleton Rose", "Mechanical Skeleton", "Dress", "41mm", BigDecimal.valueOf(18999), auren, cat);
    }

    private void createWatchIfNotExists(String id, String model, String movement, String style, String size, BigDecimal price, Brand brand, Category cat) {
        if (watchRepository.findById(id).isEmpty()) {
            Watch w = new Watch();
            w.setId(id);
            w.setNum("01");
            w.setBrand(brand);
            w.setBrandName(brand.getName());
            w.setModel(model);
            w.setPrice(price);
            w.setOriginalPrice(price.add(BigDecimal.valueOf(3000)));
            w.setRating(BigDecimal.valueOf(4.9));
            w.setReviewsCount(95);
            w.setImageUrl("/assets/watches/" + id + ".png");
            w.setCategory(cat);
            w.setCategoryName("Men");
            w.setGender("Men");
            w.setMovement(movement);
            w.setStyle(style);
            w.setCaseSize(size);
            w.setStrap("Leather");
            w.setDial("Emerald");
            w.setMaterial("Surgical 316L Steel");
            w.setWaterResistance("100m");
            w.setTagline("Exclusive luxury timepiece");
            w.setDescription("Masterfully crafted caliber designed for black-tie galas and boardroom occasions.");
            w.setIsActive(true);
            watchRepository.save(w);
        }
    }

    @Test
    @DisplayName("POST /concierge/recommendations returns top 3 scored watches with compatibility and editorial reasoning")
    void testGetRecommendations_withValidPreferences_returnsTopScoredWatches() throws Exception {
        ConciergePreferencesRequest request = new ConciergePreferencesRequest(
                List.of("black_tie", "executive_boardroom"),
                "classic",
                List.of("Automatic"),
                "8k_to_15k",
                List.of("Stainless Steel", "Italian Leather"),
                "emerald green dial"
        );

        mockMvc.perform(post("/concierge/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recommendations", hasSize(3)))
                .andExpect(jsonPath("$.data.recommendations[0].compatibilityScore", greaterThanOrEqualTo(85)))
                .andExpect(jsonPath("$.data.recommendations[0].editorialReasoning", notNullValue()))
                .andExpect(jsonPath("$.data.summaryAdvice", notNullValue()));
    }

    @Test
    @DisplayName("POST /concierge/chat returns conversational advisor advice and curated companion watches")
    void testChat_withHorologicalInquiry_returnsAdvisorReplyAndCurations() throws Exception {
        ConciergeChatRequest request = new ConciergeChatRequest(
                "I am looking for a stainless steel chronograph under 20k for daily executive wear",
                List.of(new ChatMessageDto("assistant", "Welcome to the WRISTO Vault."))
        );

        mockMvc.perform(post("/concierge/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.reply", notNullValue()))
                .andExpect(jsonPath("$.data.recommendations", hasSize(greaterThan(0))));
    }

    @Test
    @DisplayName("GET /concierge/prebaked-inquiries returns luxury pre-configured prompt scenarios")
    void testGetPrebakedInquiries_returnsPreconfiguredList() throws Exception {
        mockMvc.perform(get("/concierge/prebaked-inquiries")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.inquiries", hasSize(4)))
                .andExpect(jsonPath("$.data.inquiries[0].id").value("inq-green-dial"));
    }
}
