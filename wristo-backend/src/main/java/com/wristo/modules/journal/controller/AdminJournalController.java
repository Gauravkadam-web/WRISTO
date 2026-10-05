package com.wristo.modules.journal.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.journal.dto.*;
import com.wristo.modules.journal.service.AdminJournalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/journal")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin Editorial CMS", description = "Back-office management of editorial articles, authors, publishing workflows, and featured stories")
public class AdminJournalController {

    private final AdminJournalService adminJournalService;

    public AdminJournalController(AdminJournalService adminJournalService) {
        this.adminJournalService = adminJournalService;
    }

    @GetMapping("/articles")
    @Operation(summary = "List all editorial articles (Admin)", description = "Retrieves paginated list of all editorial articles including drafts and published pieces")
    public ResponseEntity<ApiResponse<Page<ArticleResponse>>> getAllArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        Page<ArticleResponse> articles = adminJournalService.getAllArticles(pageable);
        return ResponseEntity.ok(ApiResponse.success("Admin articles list retrieved successfully", articles));
    }

    @GetMapping("/articles/{id}")
    @Operation(summary = "Get single article by ID (Admin)", description = "Retrieves full editorial article draft or published content with companion watches")
    public ResponseEntity<ApiResponse<ArticleDetailResponse>> getArticleById(@PathVariable String id) {
        ArticleDetailResponse article = adminJournalService.getArticleById(id);
        return ResponseEntity.ok(ApiResponse.success("Article retrieved successfully", article));
    }

    @PostMapping("/articles")
    @Operation(summary = "Create a new editorial article", description = "Publishes or drafts a new horological essay with structured sections and companion watches")
    public ResponseEntity<ApiResponse<ArticleDetailResponse>> createArticle(
            @Valid @RequestBody CreateArticleRequest request
    ) {
        ArticleDetailResponse created = adminJournalService.createArticle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Editorial article created successfully", created));
    }

    @PutMapping("/articles/{id}")
    @Operation(summary = "Update an existing editorial article", description = "Updates title, excerpt, content sections, category, or companion watches")
    public ResponseEntity<ApiResponse<ArticleDetailResponse>> updateArticle(
            @PathVariable String id,
            @RequestBody UpdateArticleRequest request
    ) {
        ArticleDetailResponse updated = adminJournalService.updateArticle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Editorial article updated successfully", updated));
    }

    @DeleteMapping("/articles/{id}")
    @Operation(summary = "Delete an editorial article", description = "Permanently removes an editorial article from the database")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        adminJournalService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Editorial article deleted successfully", null));
    }

    @PatchMapping("/articles/{id}/publish")
    @Operation(summary = "Toggle article publish status", description = "Switches article state between draft and published")
    public ResponseEntity<ApiResponse<ArticleResponse>> togglePublishStatus(@PathVariable String id) {
        ArticleResponse updated = adminJournalService.togglePublishStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Article publish status updated", updated));
    }

    @PatchMapping("/articles/{id}/lead")
    @Operation(summary = "Elect article as featured lead story", description = "Promotes the selected article to lead story and demotes any previous lead story")
    public ResponseEntity<ApiResponse<ArticleResponse>> setLeadStory(@PathVariable String id) {
        ArticleResponse updated = adminJournalService.setLeadStory(id);
        return ResponseEntity.ok(ApiResponse.success("Featured lead story updated successfully", updated));
    }

    @PostMapping("/authors")
    @Operation(summary = "Create a new editorial author/curator", description = "Registers a new horology writer or specialist profile")
    public ResponseEntity<ApiResponse<AuthorDto>> createAuthor(
            @Valid @RequestBody CreateAuthorRequest request
    ) {
        AuthorDto author = adminJournalService.createAuthor(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Author profile created successfully", author));
    }

    @GetMapping("/authors")
    @Operation(summary = "List all editorial authors", description = "Retrieves all registered horologist and curator author profiles")
    public ResponseEntity<ApiResponse<List<AuthorDto>>> getAllAuthors() {
        List<AuthorDto> authors = adminJournalService.getAllAuthors();
        return ResponseEntity.ok(ApiResponse.success("Authors retrieved successfully", authors));
    }
}
