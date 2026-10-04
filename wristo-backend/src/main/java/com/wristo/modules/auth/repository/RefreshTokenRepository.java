package com.wristo.modules.auth.repository;

import com.wristo.modules.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByTokenHashAndIsRevokedFalse(String tokenHash);
    void deleteAllByUserId(UUID userId);
}
