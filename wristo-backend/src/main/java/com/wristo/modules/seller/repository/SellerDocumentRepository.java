package com.wristo.modules.seller.repository;

import com.wristo.modules.seller.entity.SellerDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerDocumentRepository extends JpaRepository<SellerDocument, UUID> {

    List<SellerDocument> findBySellerId(String sellerId);

    Optional<SellerDocument> findByIdAndSellerId(UUID id, String sellerId);
}
