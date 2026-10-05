package com.wristo.modules.cart.repository;

import com.wristo.modules.cart.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {

    @EntityGraph(attributePaths = {"appliedCoupon"})
    Optional<Cart> findByUserId(UUID userId);

    @EntityGraph(attributePaths = {"appliedCoupon"})
    Optional<Cart> findBySessionId(String sessionId);

    void deleteByUserId(UUID userId);
}
