package com.wristo.modules.auth.dto;

import java.util.UUID;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserDetailsDto user;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String refreshToken, UserDetailsDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = "Bearer";
        this.user = user;
    }

    public static class UserDetailsDto {
        private UUID id;
        private String email;
        private String fullName;
        private String role;
        private String phone;
        private String avatarUrl;

        public UserDetailsDto() {
        }

        public UserDetailsDto(UUID id, String email, String fullName, String role, String phone, String avatarUrl) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.phone = phone;
            this.avatarUrl = avatarUrl;
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserDetailsDto getUser() {
        return user;
    }

    public void setUser(UserDetailsDto user) {
        this.user = user;
    }
}
