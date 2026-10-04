package com.wristo.security.model;

import com.wristo.modules.auth.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String fullName;
    private final String role;
    private final boolean isVerified;
    private final boolean isActive;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(UUID id, String email, String password, String fullName, String role, boolean isVerified, boolean isActive, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.isVerified = isVerified;
        this.isActive = isActive;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        String roleWithPrefix = user.getRole().startsWith("ROLE_") ? user.getRole() : "ROLE_" + user.getRole();
        GrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                user.getRole(),
                user.getIsVerified() != null ? user.getIsVerified() : false,
                user.getIsActive() != null ? user.getIsActive() : true,
                Collections.singletonList(authority)
        );
    }

    public UUID getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role;
    }

    public boolean isVerified() {
        return isVerified;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
