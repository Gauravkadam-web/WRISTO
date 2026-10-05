package com.wristo.modules.catalog.repository;

import com.wristo.modules.catalog.entity.Watch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface WatchRepository extends JpaRepository<Watch, String>, JpaSpecificationExecutor<Watch> {

    Optional<Watch> findByIdAndIsActiveTrue(String id);

    Page<Watch> findAllByIsActiveTrue(Pageable pageable);

    List<Watch> findTop8ByIsActiveTrueOrderByRatingDesc();

    List<Watch> findTop4ByBrandNameAndIdNotAndIsActiveTrue(String brandName, String id);

    List<Watch> findTop4ByMovementAndIdNotAndIsActiveTrue(String movement, String id);

    List<Watch> findTop4ByIdNotAndIsActiveTrueOrderByRatingDesc(String id);

    long countByIsActiveTrue();

    @Query("SELECT MIN(w.price) FROM Watch w WHERE w.isActive = true")
    BigDecimal findMinPrice();

    @Query("SELECT MAX(w.price) FROM Watch w WHERE w.isActive = true")
    BigDecimal findMaxPrice();

    @Query("SELECT w.brandName, COUNT(w) FROM Watch w WHERE w.isActive = true GROUP BY w.brandName ORDER BY COUNT(w) DESC")
    List<Object[]> countWatchesByBrand();

    @Query("SELECT w.movement, COUNT(w) FROM Watch w WHERE w.isActive = true GROUP BY w.movement ORDER BY COUNT(w) DESC")
    List<Object[]> countWatchesByMovement();

    @Query("SELECT w.style, COUNT(w) FROM Watch w WHERE w.isActive = true GROUP BY w.style ORDER BY COUNT(w) DESC")
    List<Object[]> countWatchesByStyle();

    @Query("SELECT w FROM Watch w WHERE w.isActive = true AND (" +
            "LOWER(w.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.brandName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.movement) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.style) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.dial) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.material) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Watch> searchFullText(@Param("query") String query, Pageable pageable);

    @Query("SELECT w FROM Watch w WHERE w.isActive = true AND (" +
            "LOWER(w.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.brandName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.movement) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.style) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Watch> findTopSuggestions(@Param("query") String query, Pageable pageable);
}
