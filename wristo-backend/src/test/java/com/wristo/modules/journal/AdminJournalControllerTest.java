package com.wristo.modules.journal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.journal.dto.ContentSectionDto;
import com.wristo.modules.journal.dto.CreateArticleRequest;
import com.wristo.modules.journal.dto.CreateAuthorRequest;
import com.wristo.modules.journal.dto.UpdateArticleRequest;
import com.wristo.modules.journal.entity.Article;
import com.wristo.modules.journal.entity.Author;
import com.wristo.modules.journal.repository.ArticleRepository;
import com.wristo.modules.journal.repository.AuthorRepository;
import com.wristo.security.jwt.JwtTokenProvider;
import com.wristo.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminJournalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private AuthorRepository authorRepository;

    private String adminToken;
    private String customerToken;
    private Author testAuthor;
    private Article testArticle;

    @BeforeEach
    void setUp() {
        User admin = userRepository.findByEmail("admin@wristo.com")
                .orElseGet(() -> {
                    User u = new User();
                    u.setId(java.util.UUID.fromString("a0000000-0000-0000-0000-000000000001"));
                    u.setEmail("admin@wristo.com");
                    u.setPasswordHash(passwordEncoder.encode("Password@123"));
                    u.setFullName("System Admin");
                    u.setRole("ADMIN");
                    u.setIsVerified(true);
                    u.setIsActive(true);
                    return userRepository.save(u);
                });
        adminToken = tokenProvider.generateAccessToken(UserPrincipal.create(admin));

        User customer = userRepository.findByEmail("gauravkadam@gmail.com")
                .orElseGet(() -> {
                    User u = new User();
                    u.setId(java.util.UUID.fromString("a0000000-0000-0000-0000-000000000002"));
                    u.setEmail("gauravkadam@gmail.com");
                    u.setPasswordHash(passwordEncoder.encode("Password@123"));
                    u.setFullName("Gaurav Kadam");
                    u.setRole("CUSTOMER");
                    u.setIsVerified(true);
                    u.setIsActive(true);
                    return userRepository.save(u);
                });
        customerToken = tokenProvider.generateAccessToken(UserPrincipal.create(customer));

        testAuthor = authorRepository.findById("auth-kavita")
                .orElseGet(() -> authorRepository.save(new Author(
                        "auth-kavita",
                        "Kavita Singhania",
                        "Director of Materials",
                        "/assets/brand/curator-avatar.png",
                        "Bio for Kavita"
                )));

        testArticle = articleRepository.findById("art-test-crud")
                .orElseGet(() -> {
                    Article a = new Article();
                    a.setId("art-test-crud");
                    a.setSlug("test-metallurgy-guide");
                    a.setTitle("Test Metallurgy Guide");
                    a.setSubtitle("Subtitle for metallurgy guide");
                    a.setExcerpt("Excerpt for metallurgy guide");
                    a.setCategory("Design & Metallurgy");
                    a.setAuthor(testAuthor);
                    a.setPublishedAt(Instant.now());
                    a.setReadTime("5 min read");
                    a.setReadingTimeMinutes(5);
                    a.setCoverImage("/assets/products/watch-22.png");
                    a.setTags("[\"Metallurgy\", \"Titanium\"]");
                    a.setFeaturedWatchIds("[\"WRT-022\"]");
                    a.setContentJson("[{\"heading\":\"Section 1\",\"paragraphs\":[\"Para 1\"]}]");
                    a.setIsLeadStory(false);
                    a.setIsPublished(true);
                    a.setViewCount(50L);
                    return articleRepository.save(a);
                });
    }

    @Test
    @DisplayName("Admin Access - Should reject unauthenticated requests with 401/403")
    void testUnauthenticatedAccessRejected() throws Exception {
        mockMvc.perform(get("/admin/journal/articles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin Access - Should reject customer role with 403 Forbidden")
    void testCustomerRoleForbidden() throws Exception {
        mockMvc.perform(get("/admin/journal/articles")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /admin/journal/articles - Should allow Admin to retrieve all articles")
    void testAdminGetAllArticles() throws Exception {
        mockMvc.perform(get("/admin/journal/articles")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("page", "1")
                        .param("limit", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", not(empty())));
    }

    @Test
    @DisplayName("POST /admin/journal/articles - Should allow Admin to create a new editorial article")
    void testAdminCreateArticle() throws Exception {
        CreateArticleRequest req = new CreateArticleRequest();
        req.setTitle("Tourbillon Gravitational Symmetry");
        req.setSubtitle("Overcoming gravity with multi-axis rotational cages");
        req.setExcerpt("The pinnacle of haute horlogerie escapement engineering.");
        req.setCategory("Technical Calibers");
        req.setAuthorId(testAuthor.getId());
        req.setCoverImage("/assets/products/watch-15.png");
        req.setTags(List.of("Tourbillon", "Escapement", "Haute Horlogerie"));
        req.setFeaturedProductIds(List.of("WRT-015", "WRT-031"));
        req.setContentSections(List.of(
                new ContentSectionDto("The Escapement in Motion", List.of("A tourbillon counters the effects of earth gravity."), null, null)
        ));
        req.setIsLeadStory(false);
        req.setIsPublished(true);

        mockMvc.perform(post("/admin/journal/articles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Tourbillon Gravitational Symmetry")))
                .andExpect(jsonPath("$.data.slug", notNullValue()))
                .andExpect(jsonPath("$.data.category", is("Technical Calibers")));
    }

    @Test
    @DisplayName("PUT /admin/journal/articles/{id} - Should allow Admin to update an article")
    void testAdminUpdateArticle() throws Exception {
        UpdateArticleRequest req = new UpdateArticleRequest();
        req.setTitle("Updated Metallurgy Guide Title");
        req.setExcerpt("Updated excerpt describing 316L and titanium.");

        mockMvc.perform(put("/admin/journal/articles/" + testArticle.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.title", is("Updated Metallurgy Guide Title")))
                .andExpect(jsonPath("$.data.excerpt", is("Updated excerpt describing 316L and titanium.")));
    }

    @Test
    @DisplayName("PATCH /admin/journal/articles/{id}/publish - Should toggle publish state")
    void testAdminTogglePublish() throws Exception {
        mockMvc.perform(patch("/admin/journal/articles/" + testArticle.getId() + "/publish")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isPublished", notNullValue()));
    }

    @Test
    @DisplayName("PATCH /admin/journal/articles/{id}/lead - Should set article as lead story")
    void testAdminSetLeadStory() throws Exception {
        mockMvc.perform(patch("/admin/journal/articles/" + testArticle.getId() + "/lead")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.isLeadStory", is(true)));
    }

    @Test
    @DisplayName("POST /admin/journal/authors - Should create a new author profile")
    void testAdminCreateAuthor() throws Exception {
        CreateAuthorRequest req = new CreateAuthorRequest(
                "François-Paul Journe",
                "Independent Master Watchmaker",
                "/assets/brand/curator-avatar.png",
                "Legendary independent watchmaker and horological pioneer."
        );

        mockMvc.perform(post("/admin/journal/authors")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("François-Paul Journe")))
                .andExpect(jsonPath("$.data.role", is("Independent Master Watchmaker")));
    }

    @Test
    @DisplayName("GET /admin/journal/authors - Should list all registered authors")
    void testAdminGetAllAuthors() throws Exception {
        mockMvc.perform(get("/admin/journal/authors")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", not(empty())));
    }
}
