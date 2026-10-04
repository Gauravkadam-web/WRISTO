package com.wristo.modules.seller.repository;

import com.wristo.modules.seller.entity.SellerUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerUserRepository extends JpaRepository<SellerUser, UUID> {

    List<SellerUser> findByUserId(UUID userId);

    List<SellerUser> findBySellerId(String sellerId);

    Optional<SellerUser> findBySellerIdAndUserId(String sellerId, UUID userId);

    boolean existsBySellerIdAndUserId(String sellerId, UUID userId);
}
