package com.wristo.modules.seller.repository;

import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, String> {

    Optional<Seller> findByGstin(String gstin);

    boolean existsByGstin(String gstin);

    Page<Seller> findAllByStatus(SellerStatus status, Pageable pageable);
}
