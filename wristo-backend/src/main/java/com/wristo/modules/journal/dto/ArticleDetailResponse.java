package com.wristo.modules.journal.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.journal.entity.Article;

import java.util.ArrayList;
import java.util.List;

public class ArticleDetailResponse extends ArticleResponse {

    private List<ContentSectionDto> contentSections = new ArrayList<>();
    private List<WatchResponse> featuredProducts = new ArrayList<>();
    private AdjacentArticleDto prevArticle;
    private AdjacentArticleDto nextArticle;

    public ArticleDetailResponse() {
    }

    public static ArticleDetailResponse from(Article article,
                                             ObjectMapper objectMapper,
                                             List<WatchResponse> featuredProducts,
                                             AdjacentArticleDto prevArticle,
                                             AdjacentArticleDto nextArticle) {
        if (article == null) return null;
        ArticleDetailResponse dto = new ArticleDetailResponse();
        dto.setId(article.getId());
        dto.setSlug(article.getSlug());
        dto.setTitle(article.getTitle());
        dto.setSubtitle(article.getSubtitle());
        dto.setExcerpt(article.getExcerpt());
        dto.setCategory(article.getCategory());
        dto.setAuthor(AuthorDto.from(article.getAuthor()));
        dto.setPublishedAt(article.getPublishedAt());
        dto.setReadTime(article.getReadTime());
        dto.setReadingTimeMinutes(article.getReadingTimeMinutes());
        dto.setCoverImage(article.getCoverImage());
        dto.setIsLeadStory(article.getIsLeadStory());
        dto.setIsPublished(article.getIsPublished());
        dto.setViewCount(article.getViewCount());

        if (objectMapper != null) {
            try {
                if (article.getTags() != null && !article.getTags().isBlank()) {
                    dto.setTags(objectMapper.readValue(article.getTags(), new TypeReference<List<String>>() {}));
                }
            } catch (Exception e) {
                dto.setTags(new ArrayList<>());
            }

            try {
                if (article.getFeaturedWatchIds() != null && !article.getFeaturedWatchIds().isBlank()) {
                    dto.setFeaturedProductIds(objectMapper.readValue(article.getFeaturedWatchIds(), new TypeReference<List<String>>() {}));
                }
            } catch (Exception e) {
                dto.setFeaturedProductIds(new ArrayList<>());
            }

            try {
                if (article.getContentJson() != null && !article.getContentJson().isBlank()) {
                    dto.setContentSections(objectMapper.readValue(article.getContentJson(), new TypeReference<List<ContentSectionDto>>() {}));
                }
            } catch (Exception e) {
                dto.setContentSections(new ArrayList<>());
            }
        }

        dto.setFeaturedProducts(featuredProducts != null ? featuredProducts : new ArrayList<>());
        dto.setPrevArticle(prevArticle);
        dto.setNextArticle(nextArticle);

        return dto;
    }

    public List<ContentSectionDto> getContentSections() {
        return contentSections;
    }

    public void setContentSections(List<ContentSectionDto> contentSections) {
        this.contentSections = contentSections;
    }

    public List<WatchResponse> getFeaturedProducts() {
        return featuredProducts;
    }

    public void setFeaturedProducts(List<WatchResponse> featuredProducts) {
        this.featuredProducts = featuredProducts;
    }

    public AdjacentArticleDto getPrevArticle() {
        return prevArticle;
    }

    public void setPrevArticle(AdjacentArticleDto prevArticle) {
        this.prevArticle = prevArticle;
    }

    public AdjacentArticleDto getNextArticle() {
        return nextArticle;
    }

    public void setNextArticle(AdjacentArticleDto nextArticle) {
        this.nextArticle = nextArticle;
    }
}
