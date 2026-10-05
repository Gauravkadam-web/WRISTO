package com.wristo.modules.catalog.service;

import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.catalog.dto.*;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public CatalogPageResponse getCatalog(CatalogFilterRequest filter, Pageable pageable) {
        Specification<Watch> spec = buildSpecification(filter);
        Pageable sortedPageable = applySorting(filter.getSort(), pageable);

        Page<Watch> watchPage = watchRepository.findAll(spec, sortedPageable);

        CatalogPageResponse response = new CatalogPageResponse();
        response.setProducts(watchPage.getContent().stream().map(WatchResponse::from).collect(Collectors.toList()));
        response.setTotal(watchPage.getTotalElements());
        response.setPage(watchPage.getNumber() + 1);
        response.setTotalPages(watchPage.getTotalPages());
        response.setHasMore(watchPage.hasNext());

        response.setFacets(computeFacets());
        return response;
    }

    public WatchDetailResponse getWatchById(String id) {
        Watch watch = watchRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog: " + id));
        return WatchDetailResponse.from(watch);
    }

    public List<WatchResponse> getSimilarWatches(String id) {
        Watch target = watchRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog: " + id));

        List<Watch> similar = watchRepository.findTop4ByBrandNameAndIdNotAndIsActiveTrue(target.getBrandName(), id);
        if (similar.size() < 4) {
            List<Watch> movementMatches = watchRepository.findTop4ByMovementAndIdNotAndIsActiveTrue(target.getMovement(), id);
            for (Watch w : movementMatches) {
                if (!similar.contains(w) && !w.getId().equals(id) && similar.size() < 4) {
                    similar.add(w);
                }
            }
        }
        if (similar.size() < 4) {
            List<Watch> fallback = watchRepository.findTop4ByIdNotAndIsActiveTrueOrderByRatingDesc(id);
            for (Watch w : fallback) {
                if (!similar.contains(w) && !w.getId().equals(id) && similar.size() < 4) {
                    similar.add(w);
                }
            }
        }

        return similar.stream().map(WatchResponse::from).collect(Collectors.toList());
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAllByIsActiveTrueOrderByEstablishedAsc();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllByIsActiveTrueOrderBySortOrderAsc();
    }

    private Specification<Watch> buildSpecification(CatalogFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isActive")));

            if (filter.getBrand() != null && !filter.getBrand().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("brandName")), filter.getBrand().toLowerCase().trim()));
            }

            if (filter.getMovement() != null && !filter.getMovement().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("movement")), filter.getMovement().toLowerCase().trim()));
            }

            if (filter.getStyle() != null && !filter.getStyle().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("style")), filter.getStyle().toLowerCase().trim()));
            }

            if (filter.getGender() != null && !filter.getGender().isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("gender")), filter.getGender().toLowerCase().trim()));
            }

            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }

            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }

            if (filter.getQ() != null && !filter.getQ().isBlank()) {
                String pattern = "%" + filter.getQ().toLowerCase().trim() + "%";
                Predicate modelMatch = cb.like(cb.lower(root.get("model")), pattern);
                Predicate brandMatch = cb.like(cb.lower(root.get("brandName")), pattern);
                Predicate taglineMatch = cb.like(cb.lower(root.get("tagline")), pattern);
                Predicate descriptionMatch = cb.like(cb.lower(root.get("description")), pattern);
                predicates.add(cb.or(modelMatch, brandMatch, taglineMatch, descriptionMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Pageable applySorting(String sort, Pageable pageable) {
        Sort sortOrder;
        if ("price-low".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price-high".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "price");
        } else if ("rating".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("newest".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            sortOrder = Sort.by(Sort.Direction.ASC, "num");
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);
    }

    private CatalogFacetsResponse computeFacets() {
        CatalogFacetsResponse facets = new CatalogFacetsResponse();

        List<Object[]> brandCounts = watchRepository.countWatchesByBrand();
        facets.setBrands(brandCounts.stream()
                .map(r -> new FacetItemResponse((String) r[0], (Long) r[1]))
                .collect(Collectors.toList()));

        List<Object[]> movementCounts = watchRepository.countWatchesByMovement();
        facets.setMovements(movementCounts.stream()
                .map(r -> new FacetItemResponse((String) r[0], (Long) r[1]))
                .collect(Collectors.toList()));

        List<Object[]> styleCounts = watchRepository.countWatchesByStyle();
        facets.setStyles(styleCounts.stream()
                .map(r -> new FacetItemResponse((String) r[0], (Long) r[1]))
                .collect(Collectors.toList()));

        BigDecimal minPrice = watchRepository.findMinPrice();
        BigDecimal maxPrice = watchRepository.findMaxPrice();
        facets.setPriceRange(new PriceRangeResponse(
                minPrice != null ? minPrice : BigDecimal.valueOf(3000),
                maxPrice != null ? maxPrice : BigDecimal.valueOf(25000)
        ));

        return facets;
    }
}
