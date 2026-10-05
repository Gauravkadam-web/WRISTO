package com.wristo.modules.journal.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "journal_authors")
public class Author extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "role", length = 255, nullable = false)
    private String role;

    @Column(name = "avatar", length = 512, nullable = false)
    private String avatar;

    @Column(name = "bio", columnDefinition = "TEXT", nullable = false)
    private String bio;

    public Author() {
    }

    public Author(String id, String name, String role, String avatar, String bio) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
        this.bio = bio;
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
