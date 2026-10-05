package com.wristo.modules.journal.dto;

public class AdjacentArticleDto {

    private String slug;
    private String title;

    public AdjacentArticleDto() {
    }

    public AdjacentArticleDto(String slug, String title) {
        this.slug = slug;
        this.title = title;
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
}
