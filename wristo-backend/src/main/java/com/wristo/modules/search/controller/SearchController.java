package com.wristo.modules.search.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.search.dto.AutocompleteResponse;
import com.wristo.modules.search.dto.FullSearchResponse;
import com.wristo.modules.search.dto.PopularSearchesResponse;
import com.wristo.modules.search.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@Tag(name = "Search", description = "Instant Search, Autocomplete & Horological Discovery APIs")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/autocomplete")
    @Operation(summary = "Instant autocomplete search", description = "Returns instant brand, watch, and style suggestions matching a search prefix")
    public ResponseEntity<ApiResponse<AutocompleteResponse>> autocomplete(
            @RequestParam(name = "q", defaultValue = "") String query) {
        AutocompleteResponse response = searchService.getAutocomplete(query);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/popular")
    @Operation(summary = "Popular and trending searches", description = "Returns curated popular search terms, trending brands, and styles")
    public ResponseEntity<ApiResponse<PopularSearchesResponse>> getPopularSearches() {
        PopularSearchesResponse response = searchService.getPopularSearches();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/query")
    @Operation(summary = "Full-text horological search", description = "Performs full-text search across brands, models, movements, dials, and descriptions")
    public ResponseEntity<ApiResponse<FullSearchResponse>> fullSearch(
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        FullSearchResponse response = searchService.executeFullSearch(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
