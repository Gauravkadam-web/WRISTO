package com.wristo.modules.payment.repository;

import com.wristo.modules.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    List<Payment> findByOrderIdOrderByCreatedAtDesc(String orderId);

    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);

    void deleteByOrderId(String orderId);
}
