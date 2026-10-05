package com.wristo.modules.inventory.repository;

import com.wristo.modules.inventory.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    Optional<Inventory> findBySellerListingId(UUID sellerListingId);

    Optional<Inventory> findBySellerListingSellerIdAndSellerListingId(String sellerId, UUID sellerListingId);

    Page<Inventory> findAllBySellerListingSellerId(String sellerId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.sellerListing.id = :listingId")
    Optional<Inventory> findBySellerListingIdWithLock(@Param("listingId") UUID listingId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.id = :id")
    Optional<Inventory> findByIdWithLock(@Param("id") UUID id);
}
