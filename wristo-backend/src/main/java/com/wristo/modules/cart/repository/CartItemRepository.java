package com.wristo.modules.cart.repository;

import com.wristo.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {

    @EntityGraph(attributePaths = {"watch", "watch.brand"})
    Optional<CartItem> findByCartIdAndWatchId(String cartId, String watchId);

    @EntityGraph(attributePaths = {"watch", "watch.brand"})
    List<CartItem> findByCartId(String cartId);

    void deleteByCartId(String cartId);
}
