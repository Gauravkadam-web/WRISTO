package com.wristo.modules.wishlist.repository;

import com.wristo.modules.wishlist.entity.Wishlist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {

    Optional<Wishlist> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}
