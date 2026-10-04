package com.wristo.modules.catalog.repository;

import com.wristo.modules.catalog.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {
    Optional<Brand> findByNameIgnoreCase(String name);
    List<Brand> findAllByIsActiveTrueOrderByEstablishedAsc();
}
