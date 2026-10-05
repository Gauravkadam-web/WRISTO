package com.wristo.modules.catalog.dto;

import java.math.BigDecimal;

public class PriceRangeResponse {

    private BigDecimal min;
    private BigDecimal max;

    public PriceRangeResponse() {
    }

    public PriceRangeResponse(BigDecimal min, BigDecimal max) {
        this.min = min;
        this.max = max;
    }

    public BigDecimal getMin() { return min; }
    public void setMin(BigDecimal min) { this.min = min; }

    public BigDecimal getMax() { return max; }
    public void setMax(BigDecimal max) { this.max = max; }
}
