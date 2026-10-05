package com.wristo.modules.seller.repository;

import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.SellerListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerListingRepository extends JpaRepository<SellerListing, UUID> {

    Page<SellerListing> findAllBySellerId(String sellerId, Pageable pageable);

    Optional<SellerListing> findByIdAndSellerId(UUID id, String sellerId);

    boolean existsBySellerIdAndSellerSku(String sellerId, String sellerSku);

    List<SellerListing> findAllByWatchIdAndStatusAndIsActiveTrue(String watchId, ListingStatus status);

    Page<SellerListing> findAllByStatus(ListingStatus status, Pageable pageable);

    @Query("SELECT sl FROM SellerListing sl JOIN FETCH sl.seller s JOIN FETCH sl.watch w WHERE sl.id = :id")
    Optional<SellerListing> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT sl FROM SellerListing sl JOIN FETCH sl.seller s WHERE sl.watch.id = :watchId AND sl.status = :status AND sl.isActive = true ORDER BY sl.price ASC")
    List<SellerListing> findActiveOffersForWatch(@Param("watchId") String watchId, @Param("status") ListingStatus status);
}
