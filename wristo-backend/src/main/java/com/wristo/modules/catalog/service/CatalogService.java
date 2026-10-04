package com.wristo.modules.catalog.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private static final Logger log = LoggerFactory.getLogger(CatalogService.class);

    private final WatchRepository watchRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    public CatalogService(WatchRepository watchRepository, BrandRepository brandRepository, CategoryRepository categoryRepository) {
        this.watchRepository = watchRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    public PageResponse<Watch> getAllWatches(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size);
        Page<Watch> watchPage = watchRepository.findAllByIsActiveTrue(pageable);
        return PageResponse.from(watchPage);
    }

    public Watch getWatchById(String id) {
        return watchRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Watch not found with id: " + id));
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAllByIsActiveTrueOrderByEstablishedAsc();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllByIsActiveTrueOrderBySortOrderAsc();
    }
}
