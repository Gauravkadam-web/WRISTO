package com.wristo.modules.auth.repository;

import com.wristo.modules.auth.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {
    List<UserAddress> findByUserIdOrderByIsDefaultDescCreatedAtDesc(UUID userId);
    Optional<UserAddress> findByIdAndUserId(UUID id, UUID userId);
}
