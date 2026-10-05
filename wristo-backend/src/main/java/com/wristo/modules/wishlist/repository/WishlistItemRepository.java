package com.wristo.modules.wishlist.repository;

import com.wristo.modules.wishlist.entity.WishlistItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, String> {

    @EntityGraph(attributePaths = {"watch", "watch.brand"})
    Optional<WishlistItem> findByWishlistIdAndWatchId(String wishlistId, String watchId);

    @EntityGraph(attributePaths = {"watch", "watch.brand"})
    List<WishlistItem> findByWishlistId(String wishlistId);

    void deleteByWishlistId(String wishlistId);

    boolean existsByWishlistIdAndWatchId(String wishlistId, String watchId);
}
