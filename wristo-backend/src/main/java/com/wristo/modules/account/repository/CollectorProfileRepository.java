package com.wristo.modules.account.repository;

import com.wristo.modules.account.entity.CollectorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollectorProfileRepository extends JpaRepository<CollectorProfile, UUID> {
    Optional<CollectorProfile> findByUserId(UUID userId);
}
