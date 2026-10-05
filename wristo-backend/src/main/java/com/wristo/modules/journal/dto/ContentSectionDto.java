package com.wristo.modules.journal.dto;

import java.util.ArrayList;
import java.util.List;

public class ContentSectionDto {

    private String heading;
    private List<String> paragraphs = new ArrayList<>();
    private ContentQuoteDto quote;
    private String callout;

    public ContentSectionDto() {
    }

    public ContentSectionDto(String heading, List<String> paragraphs, ContentQuoteDto quote, String callout) {
        this.heading = heading;
        this.paragraphs = paragraphs != null ? paragraphs : new ArrayList<>();
        this.quote = quote;
        this.callout = callout;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public List<String> getParagraphs() {
        return paragraphs;
    }

    public void setParagraphs(List<String> paragraphs) {
        this.paragraphs = paragraphs;
    }

    public ContentQuoteDto getQuote() {
        return quote;
    }

    public void setQuote(ContentQuoteDto quote) {
        this.quote = quote;
    }

    public String getCallout() {
        return callout;
    }

    public void setCallout(String callout) {
        this.callout = callout;
    }
}
