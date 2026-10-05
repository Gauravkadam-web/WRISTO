package com.wristo.modules.journal.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.journal.dto.ArticleCategoryCountResponse;
import com.wristo.modules.journal.dto.ArticleDetailResponse;
import com.wristo.modules.journal.dto.ArticleResponse;
import com.wristo.modules.journal.service.JournalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/journal")
@Tag(name = "Editorial Journal", description = "Public Horological Essays, Guides, and Curated Watch Stories")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    @GetMapping("/articles")
    @Operation(summary = "Get published editorial articles", description = "Retrieves paginated articles with optional category filtering")
    public ResponseEntity<ApiResponse<Page<ArticleResponse>>> getArticles(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        Page<ArticleResponse> articles = journalService.getArticles(category, pageable);
        return ResponseEntity.ok(ApiResponse.success("Editorial articles retrieved successfully", articles));
    }

    @GetMapping("/lead")
    @Operation(summary = "Get featured lead editorial story", description = "Retrieves the primary featured lead article for the Journal hero banner")
    public ResponseEntity<ApiResponse<ArticleResponse>> getLeadStory() {
        ArticleResponse lead = journalService.getFeaturedLeadArticle();
        return ResponseEntity.ok(ApiResponse.success("Featured lead story retrieved successfully", lead));
    }

    @GetMapping("/articles/{slugOrId}")
    @Operation(summary = "Get editorial article details by slug or ID", description = "Retrieves complete article content, structured sections, author details, and companion watches")
    public ResponseEntity<ApiResponse<ArticleDetailResponse>> getArticleDetails(@PathVariable String slugOrId) {
        ArticleDetailResponse article = journalService.getArticleBySlugOrId(slugOrId);
        return ResponseEntity.ok(ApiResponse.success("Article details retrieved successfully", article));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get editorial categories with article counts", description = "Retrieves all canonical journal categories and current published article counts")
    public ResponseEntity<ApiResponse<List<ArticleCategoryCountResponse>>> getCategories() {
        List<ArticleCategoryCountResponse> categories = journalService.getCategoryCounts();
        return ResponseEntity.ok(ApiResponse.success("Editorial categories retrieved successfully", categories));
    }

    @GetMapping("/tags")
    @Operation(summary = "Get popular editorial tags", description = "Retrieves top used horology tags across published essays")
    public ResponseEntity<ApiResponse<List<String>>> getPopularTags() {
        List<String> tags = journalService.getPopularTags();
        return ResponseEntity.ok(ApiResponse.success("Editorial tags retrieved successfully", tags));
    }

    @GetMapping("/slugs")
    @Operation(summary = "Get all published article slugs", description = "Retrieves list of all article slugs for static path pre-rendering and sitemap generation")
    public ResponseEntity<ApiResponse<List<String>>> getAllSlugs() {
        List<String> slugs = journalService.getAllArticleSlugs();
        return ResponseEntity.ok(ApiResponse.success("Article slugs retrieved successfully", slugs));
    }
}
