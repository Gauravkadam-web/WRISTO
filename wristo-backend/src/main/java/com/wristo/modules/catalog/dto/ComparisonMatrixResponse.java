package com.wristo.modules.catalog.dto;

import java.util.List;

public record ComparisonMatrixResponse(
        List<ComparisonWatchSummary> watches,
        List<ComparisonSpecItem> specs,
        Integer totalCompared
) {
}
