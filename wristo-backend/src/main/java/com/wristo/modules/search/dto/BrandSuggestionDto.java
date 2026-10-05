package com.wristo.modules.search.dto;

public class BrandSuggestionDto {
    private String id;
    private String name;
    private String origin;
    private Integer watchCount;

    public BrandSuggestionDto() {
    }

    public BrandSuggestionDto(String id, String name, String origin, Integer watchCount) {
        this.id = id;
        this.name = name;
        this.origin = origin;
        this.watchCount = watchCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public Integer getWatchCount() {
        return watchCount;
    }

    public void setWatchCount(Integer watchCount) {
        this.watchCount = watchCount;
    }
}
