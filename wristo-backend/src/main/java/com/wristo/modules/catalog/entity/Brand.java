package com.wristo.modules.catalog.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "brands")
public class Brand extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 32, nullable = false)
    private String id;

    @Column(name = "name", length = 64, nullable = false, unique = true)
    private String name;

    @Column(name = "country", length = 64, nullable = false)
    private String country;

    @Column(name = "established", nullable = false)
    private Integer established;

    @Column(name = "headline", length = 255, nullable = false)
    private String headline;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Brand() {
    }

    public Brand(String id, String name, String country, Integer established, String headline, String description, String logoUrl, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.established = established;
        this.headline = headline;
        this.description = description;
        this.logoUrl = logoUrl;
        this.isActive = isActive != null ? isActive : true;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getEstablished() {
        return established;
    }

    public void setEstablished(Integer established) {
        this.established = established;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
