package com.wristo.modules.journal;

import com.wristo.modules.journal.entity.Article;
import com.wristo.modules.journal.entity.Author;
import com.wristo.modules.journal.repository.ArticleRepository;
import com.wristo.modules.journal.repository.AuthorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JournalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @BeforeEach
    void setUp() {
        Author author = authorRepository.findById("auth-adrien")
                .orElseGet(() -> authorRepository.save(new Author(
                        "auth-adrien",
                        "Adrien de Beauharnais",
                        "Master Horologist",
                        "/assets/brand/curator-avatar.png",
                        "Master Horologist bio"
                )));

        if (!articleRepository.existsBySlug("architecture-of-automatic-calibers")) {
            Article art1 = new Article();
            art1.setId("art-01");
            art1.setSlug("architecture-of-automatic-calibers");
            art1.setTitle("The Architecture of Automatic Calibers");
            art1.setSubtitle("From oscillating tungsten rotors to jewel escapements");
            art1.setExcerpt("An automatic watch is fundamentally a kinetic organism.");
            art1.setCategory("Technical Calibers");
            art1.setAuthor(author);
            art1.setPublishedAt(Instant.now());
            art1.setReadTime("6 min read");
            art1.setReadingTimeMinutes(6);
            art1.setCoverImage("/assets/products/watch-31.png");
            art1.setTags("[\"Automatic Movement\", \"Watchmaking Calibers\"]");
            art1.setFeaturedWatchIds("[\"WRT-031\", \"WRT-005\"]");
            art1.setContentJson("[{\"heading\":\"Section 1\",\"paragraphs\":[\"Paragraph 1\"],\"callout\":\"Test Callout\"}]");
            art1.setIsLeadStory(true);
            art1.setIsPublished(true);
            art1.setViewCount(100L);
            articleRepository.save(art1);
        }
    }

    @Test
    @DisplayName("GET /journal/articles - Should return paginated published editorial articles")
    void testGetArticles() throws Exception {
        mockMvc.perform(get("/journal/articles")
                        .param("page", "1")
                        .param("limit", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", not(empty())))
                .andExpect(jsonPath("$.data.content[0].title", notNullValue()))
                .andExpect(jsonPath("$.data.content[0].category", notNullValue()));
    }

    @Test
    @DisplayName("GET /journal/articles?category=Technical Calibers - Should filter articles by category")
    void testGetArticlesByCategory() throws Exception {
        mockMvc.perform(get("/journal/articles")
                        .param("category", "Technical Calibers")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", not(empty())))
                .andExpect(jsonPath("$.data.content[0].category", is("Technical Calibers")));
    }

    @Test
    @DisplayName("GET /journal/lead - Should return featured lead story for hero banner")
    void testGetLeadStory() throws Exception {
        mockMvc.perform(get("/journal/lead")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isLeadStory", is(true)))
                .andExpect(jsonPath("$.data.title", notNullValue()));
    }

    @Test
    @DisplayName("GET /journal/articles/{slug} - Should return full article with content sections")
    void testGetArticleDetailsBySlug() throws Exception {
        mockMvc.perform(get("/journal/articles/architecture-of-automatic-calibers")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.slug", is("architecture-of-automatic-calibers")))
                .andExpect(jsonPath("$.data.contentSections", not(empty())))
                .andExpect(jsonPath("$.data.author.name", is("Adrien de Beauharnais")));
    }

    @Test
    @DisplayName("GET /journal/articles/non-existent - Should return 404 NOT_FOUND")
    void testGetNonExistentArticle() throws Exception {
        mockMvc.perform(get("/journal/articles/non-existent-article-slug-xyz")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /journal/categories - Should return category list with count statistics")
    void testGetCategories() throws Exception {
        mockMvc.perform(get("/journal/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", not(empty())))
                .andExpect(jsonPath("$.data[0].category", is("All Stories")))
                .andExpect(jsonPath("$.data[0].count", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("GET /journal/tags - Should return popular horology tags")
    void testGetPopularTags() throws Exception {
        mockMvc.perform(get("/journal/tags")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", not(empty())));
    }

    @Test
    @DisplayName("GET /journal/slugs - Should return all published article slugs")
    void testGetAllSlugs() throws Exception {
        mockMvc.perform(get("/journal/slugs")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasItem("architecture-of-automatic-calibers")));
    }
}
