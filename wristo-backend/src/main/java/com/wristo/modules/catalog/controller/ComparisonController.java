package com.wristo.modules.catalog.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.catalog.dto.ComparisonMatrixResponse;
import com.wristo.modules.catalog.service.ComparisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/compare")
@Tag(name = "Comparison", description = "Horological Technical Comparison Engine APIs")
public class ComparisonController {

    private final ComparisonService comparisonService;

    public ComparisonController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @GetMapping
    @Operation(summary = "Compare timepieces side-by-side", description = "Generates a 9-axis technical comparison matrix for up to 4 timepieces")
    public ResponseEntity<ApiResponse<ComparisonMatrixResponse>> compareWatches(
            @RequestParam(name = "ids", required = false) List<String> ids,
            @RequestParam(name = "watchIds", required = false) List<String> watchIds
    ) {
        List<String> targetIds = (ids != null && !ids.isEmpty()) ? ids : watchIds;
        ComparisonMatrixResponse response = comparisonService.compareWatches(targetIds);
        return ResponseEntity.ok(ApiResponse.success("Technical comparison matrix generated", response));
    }
}
