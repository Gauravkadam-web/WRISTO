package com.wristo.modules.catalog.repository;

import com.wristo.modules.catalog.entity.WatchSpec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WatchSpecRepository extends JpaRepository<WatchSpec, Long> {
    Optional<WatchSpec> findByWatchId(String watchId);
}
