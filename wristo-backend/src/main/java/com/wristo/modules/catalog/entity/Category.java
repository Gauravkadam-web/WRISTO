package com.wristo.modules.catalog.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 32, nullable = false)
    private String id;

    @Column(name = "slug", length = 64, nullable = false, unique = true)
    private String slug;

    @Column(name = "title", length = 64, nullable = false)
    private String title;

    @Column(name = "short_title", length = 32, nullable = false)
    private String shortTitle;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 32)
    private String iconName;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Category() {
    }

    public Category(String id, String slug, String title, String shortTitle, String description, String iconName, Integer sortOrder, Boolean isActive) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.shortTitle = shortTitle;
        this.description = description;
        this.iconName = iconName;
        this.sortOrder = sortOrder != null ? sortOrder : 0;
        this.isActive = isActive != null ? isActive : true;
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

    public String getShortTitle() {
        return shortTitle;
    }

    public void setShortTitle(String shortTitle) {
        this.shortTitle = shortTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
