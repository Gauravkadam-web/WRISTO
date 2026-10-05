package com.wristo.modules.journal.dto;

public class ArticleCategoryCountResponse {

    private String category;
    private Long count;

    public ArticleCategoryCountResponse() {
    }

    public ArticleCategoryCountResponse(String category, Long count) {
        this.category = category;
        this.count = count;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
