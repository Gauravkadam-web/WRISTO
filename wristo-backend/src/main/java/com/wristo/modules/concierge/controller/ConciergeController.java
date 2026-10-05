package com.wristo.modules.concierge.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.concierge.dto.*;
import com.wristo.modules.concierge.service.ConciergeService;
import com.wristo.modules.concierge.service.HorologicalAdvisorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/concierge")
@Tag(name = "AI Concierge", description = "Private Horological Advisor & Multi-Criteria Recommendation APIs")
public class ConciergeController {

    private final ConciergeService conciergeService;
    private final HorologicalAdvisorService advisorService;

    public ConciergeController(ConciergeService conciergeService, HorologicalAdvisorService advisorService) {
        this.conciergeService = conciergeService;
        this.advisorService = advisorService;
    }

    @PostMapping("/recommendations")
    @Operation(summary = "Generate horological recommendations", description = "Scores catalog timepieces against style, occasion, caliber, and budget parameters")
    public ResponseEntity<ApiResponse<ConciergeRecommendationResponse>> getRecommendations(
            @RequestBody ConciergePreferencesRequest preferences) {
        ConciergeRecommendationResponse response = conciergeService.getRecommendations(preferences);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/chat")
    @Operation(summary = "Consult with Horological Advisor", description = "Conversational horological advisor powered by Gemini API with fallback curation")
    public ResponseEntity<ApiResponse<ConciergeChatResponse>> chat(
            @Valid @RequestBody ConciergeChatRequest request) {
        ConciergeChatResponse response = advisorService.chat(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/prebaked-inquiries")
    @Operation(summary = "Get prebaked luxury inquiries", description = "Returns curated pre-configured luxury prompts with pre-filled preferences")
    public ResponseEntity<ApiResponse<PrebakedInquiryResponse>> getPrebakedInquiries() {
        PrebakedInquiryResponse response = conciergeService.getPrebakedInquiries();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
