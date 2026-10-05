package com.wristo.modules.journal.dto;

public class ContentQuoteDto {

    private String text;
    private String attribution;

    public ContentQuoteDto() {
    }

    public ContentQuoteDto(String text, String attribution) {
        this.text = text;
        this.attribution = attribution;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAttribution() {
        return attribution;
    }

    public void setAttribution(String attribution) {
        this.attribution = attribution;
    }
}
