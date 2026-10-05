package com.wristo.modules.order.repository;

import com.wristo.modules.order.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, String> {

    List<OrderStatusHistory> findByOrderIdOrderByCreatedAtAsc(String orderId);

    void deleteByOrderId(String orderId);
}
