package com.wristo.modules.journal.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateAuthorRequest {

    @NotBlank(message = "Author name is required")
    private String name;

    @NotBlank(message = "Author role is required")
    private String role;

    @NotBlank(message = "Author avatar is required")
    private String avatar;

    @NotBlank(message = "Author bio is required")
    private String bio;

    public CreateAuthorRequest() {
    }

    public CreateAuthorRequest(String name, String role, String avatar, String bio) {
        this.name = name;
        this.role = role;
        this.avatar = avatar;
        this.bio = bio;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
