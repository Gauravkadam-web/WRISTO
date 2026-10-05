package com.wristo.modules.order.repository;

import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Optional<Order> findByCertificateNumber(String certificateNumber);

    Page<Order> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Order> findByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String customerEmail, Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    Page<Order> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus paymentStatus, Pageable pageable);

    Page<Order> findByStatusAndPaymentStatusOrderByCreatedAtDesc(OrderStatus status, PaymentStatus paymentStatus, Pageable pageable);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
           "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(o.customerEmail) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(o.certificateNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> searchOrders(@Param("query") String query, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.status = :status) " +
           "AND (:search IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.customerEmail) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> findAdminOrders(@Param("status") OrderStatus status, @Param("search") String search, Pageable pageable);

    boolean existsByOrderNumber(String orderNumber);

    boolean existsByCertificateNumber(String certificateNumber);
}
