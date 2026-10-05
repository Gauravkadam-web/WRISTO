package com.wristo.modules.search.service;

import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.search.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SearchService {

    private final WatchRepository watchRepository;
    private final BrandRepository brandRepository;

    private static final List<String> POPULAR_QUERIES = List.of(
            "Titan", "Fastrack", "Casio", "Chronograph", "Smart Watch",
            "Automatic", "AUREN", "Rose Gold", "Emerald Dial", "Skeleton", "Minimalist"
    );

    private static final List<String> TRENDING_BRANDS = List.of(
            "Titan", "Fastrack", "Casio", "AUREN", "Sonata", "Helix", "Tommy Hilfiger", "Fossil"
    );

    private static final List<String> TRENDING_STYLES = List.of(
            "Chronograph", "Automatic", "Dress", "Skeleton", "Sports", "Minimalist"
    );

    public SearchService(WatchRepository watchRepository, BrandRepository brandRepository) {
        this.watchRepository = watchRepository;
        this.brandRepository = brandRepository;
    }

    public AutocompleteResponse getAutocomplete(String query) {
        if (query == null || query.trim().length() < 1) {
            return new AutocompleteResponse("", Collections.emptyList(), Collections.emptyList(), Collections.emptyList(), 0);
        }

        String cleanQuery = query.trim();

        // 1. Match Brands
        List<Brand> matchedBrands = brandRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(cleanQuery);
        List<BrandSuggestionDto> brandDtos = matchedBrands.stream()
                .map(b -> new BrandSuggestionDto(b.getId(), b.getName(), b.getCountry(), b.getEstablished() != null ? 2026 - b.getEstablished() : 10))
                .collect(Collectors.toList());

        // 2. Match Watches (Top 6)
        List<Watch> matchedWatches = watchRepository.findTopSuggestions(cleanQuery, PageRequest.of(0, 6));
        List<SearchSuggestionItemDto> watchDtos = matchedWatches.stream()
                .map(w -> new SearchSuggestionItemDto(
                        w.getId(),
                        w.getModel(),
                        w.getBrandName(),
                        w.getPrice(),
                        w.getOriginalPrice(),
                        w.getImageUrl(),
                        w.getMovement(),
                        w.getStyle(),
                        w.getRating()
                ))
                .collect(Collectors.toList());

        // 3. Match Categories & Styles
        Set<String> matchedCategories = new LinkedHashSet<>();
        String lowerQuery = cleanQuery.toLowerCase();
        for (String style : TRENDING_STYLES) {
            if (style.toLowerCase().contains(lowerQuery)) {
                matchedCategories.add(style);
            }
        }
        for (Watch w : matchedWatches) {
            if (w.getCategoryName() != null && w.getCategoryName().toLowerCase().contains(lowerQuery)) {
                matchedCategories.add(w.getCategoryName());
            }
            if (w.getStyle() != null && w.getStyle().toLowerCase().contains(lowerQuery)) {
                matchedCategories.add(w.getStyle());
            }
        }

        int totalMatches = brandDtos.size() + watchDtos.size() + matchedCategories.size();

        return new AutocompleteResponse(cleanQuery, brandDtos, watchDtos, new ArrayList<>(matchedCategories), totalMatches);
    }

    public PopularSearchesResponse getPopularSearches() {
        return new PopularSearchesResponse(POPULAR_QUERIES, TRENDING_BRANDS, TRENDING_STYLES);
    }

    public FullSearchResponse executeFullSearch(String query, Pageable pageable) {
        String cleanQuery = (query == null) ? "" : query.trim();

        Page<Watch> pageResult;
        if (cleanQuery.isEmpty()) {
            pageResult = watchRepository.findAllByIsActiveTrue(pageable);
        } else {
            pageResult = watchRepository.searchFullText(cleanQuery, pageable);
        }

        List<WatchResponse> content = pageResult.getContent().stream()
                .map(WatchResponse::from)
                .collect(Collectors.toList());

        // Compute Facets over the results
        Map<String, Long> brandFacets = pageResult.getContent().stream()
                .collect(Collectors.groupingBy(Watch::getBrandName, Collectors.counting()));

        Map<String, Long> movementFacets = pageResult.getContent().stream()
                .collect(Collectors.groupingBy(Watch::getMovement, Collectors.counting()));

        Map<String, Long> styleFacets = pageResult.getContent().stream()
                .collect(Collectors.groupingBy(Watch::getStyle, Collectors.counting()));

        return new FullSearchResponse(
                cleanQuery,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber(),
                content,
                brandFacets,
                movementFacets,
                styleFacets
        );
    }
}
