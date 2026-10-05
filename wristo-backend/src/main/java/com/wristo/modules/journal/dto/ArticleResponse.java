package com.wristo.modules.journal.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.journal.entity.Article;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ArticleResponse {

    private String id;
    private String slug;
    private String title;
    private String subtitle;
    private String excerpt;
    private String category;
    private AuthorDto author;
    private Instant publishedAt;
    private String readTime;
    private Integer readingTimeMinutes;
    private String coverImage;
    private List<String> tags = new ArrayList<>();
    private List<String> featuredProductIds = new ArrayList<>();
    private Boolean isLeadStory;
    private Boolean isPublished;
    private Long viewCount;

    public ArticleResponse() {
    }

    public static ArticleResponse from(Article article, ObjectMapper objectMapper) {
        if (article == null) return null;
        ArticleResponse dto = new ArticleResponse();
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
        }

        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public AuthorDto getAuthor() {
        return author;
    }

    public void setAuthor(AuthorDto author) {
        this.author = author;
    }

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getReadTime() {
        return readTime;
    }

    public void setReadTime(String readTime) {
        this.readTime = readTime;
    }

    public Integer getReadingTimeMinutes() {
        return readingTimeMinutes;
    }

    public void setReadingTimeMinutes(Integer readingTimeMinutes) {
        this.readingTimeMinutes = readingTimeMinutes;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getFeaturedProductIds() {
        return featuredProductIds;
    }

    public void setFeaturedProductIds(List<String> featuredProductIds) {
        this.featuredProductIds = featuredProductIds;
    }

    public Boolean getIsLeadStory() {
        return isLeadStory;
    }

    public void setIsLeadStory(Boolean isLeadStory) {
        this.isLeadStory = isLeadStory;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public Long getViewCount() {
        return viewCount;
    }

    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }
}
