package com.wristo.modules.catalog.dto;

import java.util.Map;

public record ComparisonSpecItem(
        String label,
        String category,
        Map<String, String> values,
        Boolean isHighlight
) {
}
