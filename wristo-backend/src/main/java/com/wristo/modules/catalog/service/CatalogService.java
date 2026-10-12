package com.wristo.modules.catalog.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.catalog.dto.*;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.entity.WatchSpec;
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
        String cleanId = id != null ? id.trim() : "";
        Watch watch = watchRepository.findByIdAndIsActiveTrue(cleanId)
                .or(() -> watchRepository.findByIdAndIsActiveTrue(cleanId.toUpperCase()))
                .or(() -> watchRepository.findByIdAndIsActiveTrue(cleanId.toLowerCase()))
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

    public Page<WatchDetailResponse> getAllWatchesAdmin(String search, String brand, Boolean active, Pageable pageable) {
        Specification<Watch> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (active != null) {
                predicates.add(cb.equal(root.get("isActive"), active));
            }
            if (brand != null && !brand.trim().isEmpty() && !"ALL".equalsIgnoreCase(brand)) {
                predicates.add(cb.equal(cb.lower(root.get("brandName")), brand.trim().toLowerCase()));
            }
            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                Predicate pModel = cb.like(cb.lower(root.get("model")), term);
                Predicate pBrand = cb.like(cb.lower(root.get("brandName")), term);
                Predicate pId = cb.like(cb.lower(root.get("id")), term);
                predicates.add(cb.or(pModel, pBrand, pId));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Watch> page = watchRepository.findAll(spec, pageable);
        return page.map(WatchDetailResponse::from);
    }

    public WatchDetailResponse getWatchByIdAdmin(String id) {
        String cleanId = id != null ? id.trim() : "";
        Watch watch = watchRepository.findById(cleanId)
                .or(() -> watchRepository.findById(cleanId.toUpperCase()))
                .or(() -> watchRepository.findById(cleanId.toLowerCase()))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog: " + id));
        return WatchDetailResponse.from(watch);
    }

    @Transactional
    public WatchDetailResponse createWatch(CreateWatchRequest req) {
        String id = req.getId();
        if (id == null || id.trim().isEmpty()) {
            long count = watchRepository.count();
            id = String.format("WRT-%03d", count + 1);
        } else {
            id = id.trim().toUpperCase();
        }

        if (watchRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST_DATA, "A timepiece with ID " + id + " already exists in the catalog");
        }

        Brand brand = null;
        if (req.getBrandId() != null) {
            brand = brandRepository.findById(String.valueOf(req.getBrandId())).orElse(null);
        }
        if (brand == null && req.getBrandName() != null) {
            brand = brandRepository.findByNameIgnoreCase(req.getBrandName().trim()).orElse(null);
        }
        if (brand == null) {
            List<Brand> allBrands = brandRepository.findAll();
            brand = !allBrands.isEmpty() ? allBrands.get(0) : null;
        }

        Category category = null;
        if (req.getCategoryId() != null) {
            category = categoryRepository.findById(String.valueOf(req.getCategoryId())).orElse(null);
        }
        if (category == null && req.getCategoryName() != null) {
            category = categoryRepository.findBySlugIgnoreCase(req.getCategoryName().trim()).orElse(null);
        }
        if (category == null) {
            List<Category> allCats = categoryRepository.findAll();
            category = !allCats.isEmpty() ? allCats.get(0) : null;
        }

        Watch watch = new Watch();
        watch.setId(id);
        watch.setNum(req.getNum() != null ? req.getNum() : id.replace("WRT-", ""));
        watch.setBrand(brand);
        watch.setBrandName(req.getBrandName() != null ? req.getBrandName() : (brand != null ? brand.getName() : "WRISTO"));
        watch.setModel(req.getModel());
        watch.setPrice(req.getPrice());
        watch.setOriginalPrice(req.getOriginalPrice() != null ? req.getOriginalPrice() : req.getPrice().multiply(BigDecimal.valueOf(1.2)));
        watch.setImageUrl(req.getImageUrl() != null && !req.getImageUrl().trim().isEmpty() ? req.getImageUrl() : "/assets/products/watch-01.png");
        watch.setCategory(category);
        watch.setCategoryName(req.getCategoryName() != null ? req.getCategoryName() : (category != null ? category.getTitle() : "Men"));
        watch.setGender(req.getGender() != null ? req.getGender() : "Men");
        watch.setMovement(req.getMovement() != null ? req.getMovement() : "Automatic");
        watch.setStyle(req.getStyle() != null ? req.getStyle() : "Luxury");
        watch.setCaseSize(req.getCaseSize() != null ? req.getCaseSize() : "41mm");
        watch.setStrap(req.getStrap() != null ? req.getStrap() : "Leather");
        watch.setDial(req.getDial() != null ? req.getDial() : "Sunray Dial");
        watch.setMaterial(req.getMaterial() != null ? req.getMaterial() : "Stainless Steel");
        watch.setWaterResistance(req.getWaterResistance() != null ? req.getWaterResistance() : "50m");
        watch.setBadge(req.getBadge());
        watch.setTagline(req.getTagline() != null ? req.getTagline() : "Precision horology curated for the modern collector.");
        watch.setDescription(req.getDescription() != null ? req.getDescription() : "Exquisite timepiece crafted to rigorous Swiss standards.");
        watch.setAiMatchScore(req.getAiMatchScore() != null ? req.getAiMatchScore() : 95);
        watch.setAiReason(req.getAiReason() != null ? req.getAiReason() : "Pairs impeccably with tailored evening ensembles.");
        watch.setStockCount(req.getStockCount() != null ? req.getStockCount() : 10);
        watch.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);

        WatchSpec spec = new WatchSpec();
        spec.setWatch(watch);
        spec.setCaseDiameterMm(req.getCaseDiameterMm() != null ? req.getCaseDiameterMm() : watch.getCaseSize());
        spec.setCaseMaterial(req.getCaseMaterial() != null ? req.getCaseMaterial() : watch.getMaterial());
        spec.setDialFinish(req.getDialFinish() != null ? req.getDialFinish() : watch.getDial());
        spec.setStrapMaterial(req.getStrapMaterial() != null ? req.getStrapMaterial() : watch.getStrap());
        spec.setWaterResistanceAtm(req.getWaterResistanceAtm() != null ? req.getWaterResistanceAtm() : watch.getWaterResistance());
        spec.setPowerReserveHours(req.getPowerReserveHours() != null ? req.getPowerReserveHours() : "48 Hours");
        spec.setGlassCrystal(req.getGlassCrystal() != null ? req.getGlassCrystal() : "Sapphire Crystal (Anti-Reflective)");
        spec.setClaspType(req.getClaspType() != null ? req.getClaspType() : "Deployant Safety Clasp");
        spec.setWarrantyPeriod(req.getWarrantyPeriod() != null ? req.getWarrantyPeriod() : "2-Year International Warranty");

        watch.setSpecs(spec);

        Watch saved = watchRepository.save(watch);
        log.info("Admin created new canonical watch: {} ({})", saved.getId(), saved.getModel());
        return WatchDetailResponse.from(saved);
    }

    @Transactional
    public WatchDetailResponse updateWatch(String id, UpdateWatchRequest req) {
        Watch watch = watchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog: " + id));

        if (req.getModel() != null) watch.setModel(req.getModel());
        if (req.getPrice() != null) watch.setPrice(req.getPrice());
        if (req.getOriginalPrice() != null) watch.setOriginalPrice(req.getOriginalPrice());
        if (req.getImageUrl() != null && !req.getImageUrl().trim().isEmpty()) watch.setImageUrl(req.getImageUrl());
        if (req.getBrandName() != null) watch.setBrandName(req.getBrandName());
        if (req.getCategoryName() != null) watch.setCategoryName(req.getCategoryName());
        if (req.getGender() != null) watch.setGender(req.getGender());
        if (req.getMovement() != null) watch.setMovement(req.getMovement());
        if (req.getStyle() != null) watch.setStyle(req.getStyle());
        if (req.getCaseSize() != null) watch.setCaseSize(req.getCaseSize());
        if (req.getStrap() != null) watch.setStrap(req.getStrap());
        if (req.getDial() != null) watch.setDial(req.getDial());
        if (req.getMaterial() != null) watch.setMaterial(req.getMaterial());
        if (req.getWaterResistance() != null) watch.setWaterResistance(req.getWaterResistance());
        if (req.getBadge() != null) watch.setBadge(req.getBadge().isEmpty() ? null : req.getBadge());
        if (req.getTagline() != null) watch.setTagline(req.getTagline());
        if (req.getDescription() != null) watch.setDescription(req.getDescription());
        if (req.getAiMatchScore() != null) watch.setAiMatchScore(req.getAiMatchScore());
        if (req.getAiReason() != null) watch.setAiReason(req.getAiReason());
        if (req.getStockCount() != null) watch.setStockCount(req.getStockCount());
        if (req.getIsActive() != null) watch.setIsActive(req.getIsActive());

        WatchSpec spec = watch.getSpecs();
        if (spec == null) {
            spec = new WatchSpec();
            spec.setWatch(watch);
            watch.setSpecs(spec);
        }
        if (req.getCaseDiameterMm() != null) spec.setCaseDiameterMm(req.getCaseDiameterMm());
        if (req.getCaseMaterial() != null) spec.setCaseMaterial(req.getCaseMaterial());
        if (req.getDialFinish() != null) spec.setDialFinish(req.getDialFinish());
        if (req.getStrapMaterial() != null) spec.setStrapMaterial(req.getStrapMaterial());
        if (req.getWaterResistanceAtm() != null) spec.setWaterResistanceAtm(req.getWaterResistanceAtm());
        if (req.getPowerReserveHours() != null) spec.setPowerReserveHours(req.getPowerReserveHours());
        if (req.getGlassCrystal() != null) spec.setGlassCrystal(req.getGlassCrystal());
        if (req.getClaspType() != null) spec.setClaspType(req.getClaspType());
        if (req.getWarrantyPeriod() != null) spec.setWarrantyPeriod(req.getWarrantyPeriod());

        Watch saved = watchRepository.save(watch);
        log.info("Admin updated canonical watch: {} ({})", saved.getId(), saved.getModel());
        return WatchDetailResponse.from(saved);
    }

    @Transactional
    public void deleteWatch(String id) {
        Watch watch = watchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog: " + id));
        watch.setIsActive(false);
        watchRepository.save(watch);
        log.info("Admin archived/soft-deleted watch: {}", id);
    }

    @Transactional
    public WatchDetailResponse toggleWatchActive(String id) {
        Watch watch = watchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog: " + id));
        watch.setIsActive(!watch.getIsActive());
        Watch saved = watchRepository.save(watch);
        log.info("Admin toggled active status for watch: {} -> {}", id, saved.getIsActive());
        return WatchDetailResponse.from(saved);
    }
}
