package com.wristo.modules.order.repository;

import com.wristo.modules.order.entity.OrderItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

    @EntityGraph(attributePaths = {"watch", "seller"})
    List<OrderItem> findByOrderId(String orderId);

    void deleteByOrderId(String orderId);
}
