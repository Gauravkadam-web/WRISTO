package com.wristo.modules.journal.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "journal_articles")
public class Article extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "slug", length = 255, nullable = false, unique = true)
    private String slug;

    @Column(name = "title", length = 512, nullable = false)
    private String title;

    @Column(name = "subtitle", length = 1024, nullable = false)
    private String subtitle;

    @Column(name = "excerpt", columnDefinition = "TEXT", nullable = false)
    private String excerpt;

    @Column(name = "category", length = 64, nullable = false)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Author author;

    @Column(name = "published_at", nullable = false)
    private Instant publishedAt = Instant.now();

    @Column(name = "read_time", length = 32, nullable = false)
    private String readTime = "5 min read";

    @Column(name = "reading_time_minutes", nullable = false)
    private Integer readingTimeMinutes = 5;

    @Column(name = "cover_image", length = 512, nullable = false)
    private String coverImage;

    @Column(name = "tags", columnDefinition = "TEXT", nullable = false)
    private String tags;

    @Column(name = "featured_watch_ids", columnDefinition = "TEXT", nullable = false)
    private String featuredWatchIds;

    @Column(name = "content_json", columnDefinition = "TEXT", nullable = false)
    private String contentJson;

    @Column(name = "is_lead_story", nullable = false)
    private Boolean isLeadStory = false;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = true;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    public Article() {
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

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
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

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getFeaturedWatchIds() {
        return featuredWatchIds;
    }

    public void setFeaturedWatchIds(String featuredWatchIds) {
        this.featuredWatchIds = featuredWatchIds;
    }

    public String getContentJson() {
        return contentJson;
    }

    public void setContentJson(String contentJson) {
        this.contentJson = contentJson;
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
