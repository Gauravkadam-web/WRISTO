package com.wristo.modules.journal.dto;

import com.wristo.modules.journal.entity.Author;

public class AuthorDto {

    private String id;
    private String name;
    private String role;
    private String avatar;
    private String bio;

    public AuthorDto() {
    }

    public AuthorDto(String id, String name, String role, String avatar, String bio) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
        this.bio = bio;
    }

    public static AuthorDto from(Author author) {
        if (author == null) return null;
        return new AuthorDto(
                author.getId(),
                author.getName(),
                author.getRole(),
                author.getAvatar(),
                author.getBio()
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
