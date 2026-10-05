package com.wristo.modules.catalog.dto;

import com.wristo.modules.catalog.entity.Watch;

public class WatchDetailResponse extends WatchResponse {

    private WatchSpecDto specs;

    public WatchDetailResponse() {
        super();
    }

    public static WatchDetailResponse from(Watch watch) {
        if (watch == null) return null;
        WatchDetailResponse dto = new WatchDetailResponse();
        dto.setId(watch.getId());
        dto.setNum(watch.getNum());
        dto.setBrand(watch.getBrandName());
        dto.setModel(watch.getModel());
        dto.setPrice(watch.getPrice());
        dto.setOriginalPrice(watch.getOriginalPrice());
        dto.setRating(watch.getRating());
        dto.setReviewsCount(watch.getReviewsCount());
        dto.setImage(watch.getImageUrl());
        dto.setCategory(watch.getCategoryName());
        dto.setGender(watch.getGender());
        dto.setMovement(watch.getMovement());
        dto.setStyle(watch.getStyle());
        dto.setCaseSize(watch.getCaseSize());
        dto.setStrap(watch.getStrap());
        dto.setDial(watch.getDial());
        dto.setMaterial(watch.getMaterial());
        dto.setWaterResistance(watch.getWaterResistance());
        dto.setBadge(watch.getBadge());
        dto.setTagline(watch.getTagline());
        dto.setDescription(watch.getDescription());
        dto.setAiMatchScore(watch.getAiMatchScore());
        dto.setAiReason(watch.getAiReason());
        dto.setStockCount(watch.getStockCount());
        dto.setIsActive(watch.getIsActive());

        if (watch.getSpecs() != null) {
            dto.setSpecs(WatchSpecDto.from(watch.getSpecs()));
        }
        return dto;
    }

    public WatchSpecDto getSpecs() { return specs; }
    public void setSpecs(WatchSpecDto specs) { this.specs = specs; }
}
