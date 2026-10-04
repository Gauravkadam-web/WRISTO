package com.wristo.modules.seller.repository;

import com.wristo.modules.seller.entity.SellerBrandAuthorization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerBrandAuthorizationRepository extends JpaRepository<SellerBrandAuthorization, UUID> {

    List<SellerBrandAuthorization> findBySellerId(String sellerId);

    Optional<SellerBrandAuthorization> findBySellerIdAndBrandId(String sellerId, String brandId);

    Optional<SellerBrandAuthorization> findByIdAndSellerId(UUID id, String sellerId);

    boolean existsBySellerIdAndBrandId(String sellerId, String brandId);
}
