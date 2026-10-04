package com.wristo.modules.catalog.repository;

import com.wristo.modules.catalog.entity.Watch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchRepository extends JpaRepository<Watch, String>, JpaSpecificationExecutor<Watch> {
    Optional<Watch> findByIdAndIsActiveTrue(String id);
    Page<Watch> findAllByIsActiveTrue(Pageable pageable);
    List<Watch> findTop8ByIsActiveTrueOrderByRatingDesc();
    long countByIsActiveTrue();
}
