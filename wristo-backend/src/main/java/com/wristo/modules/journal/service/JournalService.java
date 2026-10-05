package com.wristo.modules.journal.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.journal.dto.AdjacentArticleDto;
import com.wristo.modules.journal.dto.ArticleCategoryCountResponse;
import com.wristo.modules.journal.dto.ArticleDetailResponse;
import com.wristo.modules.journal.dto.ArticleResponse;
import com.wristo.modules.journal.entity.Article;
import com.wristo.modules.journal.repository.ArticleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class JournalService {

    private static final Logger log = LoggerFactory.getLogger(JournalService.class);

    private final ArticleRepository articleRepository;
    private final WatchRepository watchRepository;
    private final ObjectMapper objectMapper;

    public JournalService(ArticleRepository articleRepository,
                          WatchRepository watchRepository,
                          ObjectMapper objectMapper) {
        this.articleRepository = articleRepository;
        this.watchRepository = watchRepository;
        this.objectMapper = objectMapper;
    }

    public Page<ArticleResponse> getArticles(String category, Pageable pageable) {
        Page<Article> articlesPage;
        if (category == null || category.trim().isEmpty() || "All Stories".equalsIgnoreCase(category.trim())) {
            articlesPage = articleRepository.findByIsPublishedTrueOrderByPublishedAtDesc(pageable);
        } else {
            articlesPage = articleRepository.findByCategoryIgnoreCaseAndIsPublishedTrueOrderByPublishedAtDesc(category.trim(), pageable);
        }
        return articlesPage.map(a -> ArticleResponse.from(a, objectMapper));
    }

    public ArticleResponse getFeaturedLeadArticle() {
        Article lead = articleRepository.findFirstByIsLeadStoryTrueAndIsPublishedTrueOrderByPublishedAtDesc()
                .orElseGet(() -> {
                    List<Article> latest = articleRepository.findByIsPublishedTrueOrderByPublishedAtDesc();
                    if (!latest.isEmpty()) {
                        return latest.get(0);
                    }
                    throw new ResourceNotFoundException("No published editorial articles found");
                });
        return ArticleResponse.from(lead, objectMapper);
    }

    @Transactional
    public ArticleDetailResponse getArticleBySlugOrId(String slugOrId) {
        if (slugOrId == null || slugOrId.trim().isEmpty()) {
            throw new ResourceNotFoundException("Article identifier cannot be blank");
        }

        String query = slugOrId.trim();
        Article article = articleRepository.findBySlugAndIsPublishedTrue(query)
                .or(() -> articleRepository.findByIdAndIsPublishedTrue(query))
                .orElseThrow(() -> new ResourceNotFoundException("Editorial article not found: " + query));

        // Increment view count
        try {
            articleRepository.incrementViewCount(article.getId());
            article.setViewCount(article.getViewCount() + 1);
        } catch (Exception e) {
            log.warn("Failed to increment view count for article: {}", article.getId(), e);
        }

        // Fetch companion watches
        List<WatchResponse> featuredProducts = resolveCompanionWatches(article.getFeaturedWatchIds());

        // Resolve previous and next articles
        AdjacentArticleDto prevArticle = articleRepository
                .findFirstByIsPublishedTrueAndPublishedAtLessThanOrderByPublishedAtDesc(article.getPublishedAt())
                .map(a -> new AdjacentArticleDto(a.getSlug(), a.getTitle()))
                .orElse(null);

        AdjacentArticleDto nextArticle = articleRepository
                .findFirstByIsPublishedTrueAndPublishedAtGreaterThanOrderByPublishedAtAsc(article.getPublishedAt())
                .map(a -> new AdjacentArticleDto(a.getSlug(), a.getTitle()))
                .orElse(null);

        return ArticleDetailResponse.from(article, objectMapper, featuredProducts, prevArticle, nextArticle);
    }

    public List<ArticleCategoryCountResponse> getCategoryCounts() {
        List<Object[]> rawCounts = articleRepository.countPublishedArticlesByCategoryGroup();
        Map<String, Long> countMap = new LinkedHashMap<>();
        long totalCount = 0;

        for (Object[] row : rawCounts) {
            String category = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            countMap.put(category, count);
            totalCount += count;
        }

        List<ArticleCategoryCountResponse> results = new ArrayList<>();
        results.add(new ArticleCategoryCountResponse("All Stories", totalCount));

        // Canonical category order
        List<String> canonicalCategories = List.of(
                "Horological Heritage",
                "Technical Calibers",
                "Collector Guide",
                "Design & Metallurgy"
        );

        for (String cat : canonicalCategories) {
            results.add(new ArticleCategoryCountResponse(cat, countMap.getOrDefault(cat, 0L)));
        }

        // Add any other dynamic categories if present
        for (Map.Entry<String, Long> entry : countMap.entrySet()) {
            if (!canonicalCategories.contains(entry.getKey())) {
                results.add(new ArticleCategoryCountResponse(entry.getKey(), entry.getValue()));
            }
        }

        return results;
    }

    public List<String> getPopularTags() {
        List<Article> publishedArticles = articleRepository.findByIsPublishedTrueOrderByPublishedAtDesc();
        Map<String, Integer> tagCounts = new HashMap<>();

        for (Article article : publishedArticles) {
            if (article.getTags() != null && !article.getTags().isBlank()) {
                try {
                    List<String> tags = objectMapper.readValue(article.getTags(), new TypeReference<List<String>>() {});
                    for (String tag : tags) {
                        if (tag != null && !tag.trim().isEmpty()) {
                            String trimmed = tag.trim();
                            tagCounts.put(trimmed, tagCounts.getOrDefault(trimmed, 0) + 1);
                        }
                    }
                } catch (Exception e) {
                    log.debug("Error deserializing tags for article {}", article.getId());
                }
            }
        }

        return tagCounts.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public List<String> getAllArticleSlugs() {
        return articleRepository.findByIsPublishedTrueOrderByPublishedAtDesc().stream()
                .map(Article::getSlug)
                .collect(Collectors.toList());
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

            // Preserve original ordering in featuredProductIds
            List<WatchResponse> responses = new ArrayList<>();
            for (String id : watchIds) {
                Watch w = watchMap.get(id);
                if (w != null) {
                    responses.add(WatchResponse.from(w));
                }
            }
            return responses;
        } catch (Exception e) {
            log.warn("Error parsing featuredWatchIds: {}", featuredWatchIdsJson, e);
            return Collections.emptyList();
        }
    }
}
