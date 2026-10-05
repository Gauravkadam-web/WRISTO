package com.wristo.modules.concierge.dto;

import java.util.List;

public class PrebakedInquiryResponse {
    private List<PrebakedInquiryDto> inquiries;

    public PrebakedInquiryResponse() {
    }

    public PrebakedInquiryResponse(List<PrebakedInquiryDto> inquiries) {
        this.inquiries = inquiries;
    }

    public List<PrebakedInquiryDto> getInquiries() {
        return inquiries;
    }

    public void setInquiries(List<PrebakedInquiryDto> inquiries) {
        this.inquiries = inquiries;
    }
}
