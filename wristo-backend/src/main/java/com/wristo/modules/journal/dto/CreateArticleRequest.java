package com.wristo.modules.journal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class CreateArticleRequest {

    private String slug;

    @NotBlank(message = "Title is required")
    private String title;

    private String subtitle;

    @NotBlank(message = "Excerpt is required")
    private String excerpt;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Author ID is required")
    private String authorId;

    private String readTime;

    private Integer readingTimeMinutes;

    @NotBlank(message = "Cover image is required")
    private String coverImage;

    private List<String> tags = new ArrayList<>();

    private List<String> featuredProductIds = new ArrayList<>();

    @NotNull(message = "Content sections cannot be null")
    private List<ContentSectionDto> contentSections = new ArrayList<>();

    private Boolean isLeadStory = false;

    private Boolean isPublished = true;

    public CreateArticleRequest() {
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

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
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

    public List<ContentSectionDto> getContentSections() {
        return contentSections;
    }

    public void setContentSections(List<ContentSectionDto> contentSections) {
        this.contentSections = contentSections;
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
}
