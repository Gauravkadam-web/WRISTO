package com.wristo.modules.journal.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.journal.dto.*;
import com.wristo.modules.journal.entity.Article;
import com.wristo.modules.journal.entity.Author;
import com.wristo.modules.journal.repository.ArticleRepository;
import com.wristo.modules.journal.repository.AuthorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminJournalService {

    private static final Logger log = LoggerFactory.getLogger(AdminJournalService.class);
    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private final ArticleRepository articleRepository;
    private final AuthorRepository authorRepository;
    private final WatchRepository watchRepository;
    private final ObjectMapper objectMapper;

    public AdminJournalService(ArticleRepository articleRepository,
                               AuthorRepository authorRepository,
                               WatchRepository watchRepository,
                               ObjectMapper objectMapper) {
        this.articleRepository = articleRepository;
        this.authorRepository = authorRepository;
        this.watchRepository = watchRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public Page<ArticleResponse> getAllArticles(Pageable pageable) {
        return articleRepository.findAll(pageable)
                .map(a -> ArticleResponse.from(a, objectMapper));
    }

    @Transactional(readOnly = true)
    public ArticleDetailResponse getArticleById(String id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Editorial article not found with ID: " + id));

        List<WatchResponse> featuredProducts = resolveCompanionWatches(article.getFeaturedWatchIds());
        return ArticleDetailResponse.from(article, objectMapper, featuredProducts, null, null);
    }

    public ArticleDetailResponse createArticle(CreateArticleRequest request) {
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with ID: " + request.getAuthorId()));

        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? toSlug(request.getSlug())
                : toSlug(request.getTitle());

        if (articleRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        Article article = new Article();
        article.setId("art-" + UUID.randomUUID().toString().substring(0, 8));
        article.setSlug(slug);
        article.setTitle(request.getTitle());
        article.setSubtitle(request.getSubtitle() != null ? request.getSubtitle() : "");
        article.setExcerpt(request.getExcerpt());
        article.setCategory(request.getCategory());
        article.setAuthor(author);
        article.setCoverImage(request.getCoverImage());
        article.setPublishedAt(Instant.now());

        int readMins = request.getReadingTimeMinutes() != null && request.getReadingTimeMinutes() > 0
                ? request.getReadingTimeMinutes()
                : calculateReadingTime(request.getContentSections());
        article.setReadingTimeMinutes(readMins);
        article.setReadTime(request.getReadTime() != null && !request.getReadTime().isBlank()
                ? request.getReadTime()
                : readMins + " min read");

        try {
            article.setTags(objectMapper.writeValueAsString(request.getTags() != null ? request.getTags() : Collections.emptyList()));
            article.setFeaturedWatchIds(objectMapper.writeValueAsString(request.getFeaturedProductIds() != null ? request.getFeaturedProductIds() : Collections.emptyList()));
            article.setContentJson(objectMapper.writeValueAsString(request.getContentSections() != null ? request.getContentSections() : Collections.emptyList()));
        } catch (Exception e) {
            log.error("Failed to serialize article JSON content", e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to serialize article JSON content");
        }

        boolean isLead = Boolean.TRUE.equals(request.getIsLeadStory());
        if (isLead) {
            articleRepository.clearAllLeadStories();
        }
        article.setIsLeadStory(isLead);
        article.setIsPublished(request.getIsPublished() != null ? request.getIsPublished() : true);
        article.setViewCount(0L);

        Article saved = articleRepository.save(article);
        List<WatchResponse> featured = resolveCompanionWatches(saved.getFeaturedWatchIds());
        return ArticleDetailResponse.from(saved, objectMapper, featured, null, null);
    }

    public ArticleDetailResponse updateArticle(String id, UpdateArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            article.setTitle(request.getTitle());
        }
        if (request.getSubtitle() != null) {
            article.setSubtitle(request.getSubtitle());
        }
        if (request.getExcerpt() != null && !request.getExcerpt().isBlank()) {
            article.setExcerpt(request.getExcerpt());
        }
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            article.setCategory(request.getCategory());
        }
        if (request.getCoverImage() != null && !request.getCoverImage().isBlank()) {
            article.setCoverImage(request.getCoverImage());
        }

        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String newSlug = toSlug(request.getSlug());
            if (articleRepository.existsBySlugAndIdNot(newSlug, id)) {
                throw new BusinessException(ErrorCode.ARTICLE_ALREADY_EXISTS, "An article with slug '" + newSlug + "' already exists");
            }
            article.setSlug(newSlug);
        }

        if (request.getAuthorId() != null && !request.getAuthorId().isBlank()) {
            Author author = authorRepository.findById(request.getAuthorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Author not found with ID: " + request.getAuthorId()));
            article.setAuthor(author);
        }

        if (request.getReadingTimeMinutes() != null && request.getReadingTimeMinutes() > 0) {
            article.setReadingTimeMinutes(request.getReadingTimeMinutes());
        }
        if (request.getReadTime() != null && !request.getReadTime().isBlank()) {
            article.setReadTime(request.getReadTime());
        }

        try {
            if (request.getTags() != null) {
                article.setTags(objectMapper.writeValueAsString(request.getTags()));
            }
            if (request.getFeaturedProductIds() != null) {
                article.setFeaturedWatchIds(objectMapper.writeValueAsString(request.getFeaturedProductIds()));
            }
            if (request.getContentSections() != null) {
                article.setContentJson(objectMapper.writeValueAsString(request.getContentSections()));
            }
        } catch (Exception e) {
            log.error("Failed to serialize article JSON content", e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to serialize article JSON content");
        }

        if (request.getIsLeadStory() != null) {
            if (Boolean.TRUE.equals(request.getIsLeadStory())) {
                articleRepository.clearAllLeadStories();
                article.setIsLeadStory(true);
            } else {
                article.setIsLeadStory(false);
            }
        }

        if (request.getIsPublished() != null) {
            article.setIsPublished(request.getIsPublished());
        }

        Article saved = articleRepository.save(article);
        List<WatchResponse> featured = resolveCompanionWatches(saved.getFeaturedWatchIds());
        return ArticleDetailResponse.from(saved, objectMapper, featured, null, null);
    }

    public void deleteArticle(String id) {
        if (!articleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Article not found with ID: " + id);
        }
        articleRepository.deleteById(id);
    }

    public ArticleResponse togglePublishStatus(String id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));
        article.setIsPublished(!Boolean.TRUE.equals(article.getIsPublished()));
        Article saved = articleRepository.save(article);
        return ArticleResponse.from(saved, objectMapper);
    }

    public ArticleResponse setLeadStory(String id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));

        articleRepository.clearAllLeadStories();
        article.setIsLeadStory(true);
        article.setIsPublished(true);
        Article saved = articleRepository.save(article);
        return ArticleResponse.from(saved, objectMapper);
    }

    public AuthorDto createAuthor(CreateAuthorRequest request) {
        Author author = new Author();
        author.setId("auth-" + UUID.randomUUID().toString().substring(0, 8));
        author.setName(request.getName());
        author.setRole(request.getRole());
        author.setAvatar(request.getAvatar());
        author.setBio(request.getBio());

        Author saved = authorRepository.save(author);
        return AuthorDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(AuthorDto::from)
                .collect(Collectors.toList());
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input.trim().toLowerCase()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        return slug.replaceAll("-+", "-").replaceAll("^-|-$", "");
    }

    private int calculateReadingTime(List<ContentSectionDto> sections) {
        if (sections == null || sections.isEmpty()) return 5;
        int wordCount = 0;
        for (ContentSectionDto s : sections) {
            if (s.getParagraphs() != null) {
                for (String p : s.getParagraphs()) {
                    wordCount += p.split("\\s+").length;
                }
            }
        }
        int mins = Math.max(1, (int) Math.ceil((double) wordCount / 200.0));
        return mins;
    }

    private List<WatchResponse> resolveCompanionWatches(String featuredWatchIdsJson) {
        if (featuredWatchIdsJson == null || featuredWatchIdsJson.isBlank()) {
            return Collections.emptyList();
        }

        try {
            List<String> watchIds = objectMapper.readValue(featuredWatchIdsJson, new TypeReference<List<String>>() {});
            if (watchIds.isEmpty()) {
                return Collections.emptyList();
            }

            List<Watch> watches = watchRepository.findAllById(watchIds);
            Map<String, Watch> watchMap = watches.stream().collect(Collectors.toMap(Watch::getId, w -> w));

            List<WatchResponse> responses = new ArrayList<>();
            for (String id : watchIds) {
                Watch w = watchMap.get(id);
                if (w != null) {
                    responses.add(WatchResponse.from(w));
                }
            }
            return responses;
        } catch (Exception e) {
            log.warn("Error parsing featuredWatchIds in admin: {}", featuredWatchIdsJson, e);
            return Collections.emptyList();
        }
    }
}
