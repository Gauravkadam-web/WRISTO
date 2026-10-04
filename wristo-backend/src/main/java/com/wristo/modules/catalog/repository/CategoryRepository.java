package com.wristo.modules.catalog.repository;

import com.wristo.modules.catalog.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlugIgnoreCase(String slug);
    List<Category> findAllByIsActiveTrueOrderBySortOrderAsc();
}
