package com.wristo.modules.checkout.repository;

import com.wristo.modules.checkout.entity.CheckoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckoutSessionRepository extends JpaRepository<CheckoutSession, String> {

    Optional<CheckoutSession> findByIdAndIsCompletedFalse(String id);

    List<CheckoutSession> findByUserIdAndIsCompletedFalse(UUID userId);

    List<CheckoutSession> findBySessionIdAndIsCompletedFalse(String sessionId);

    List<CheckoutSession> findByExpiresAtBeforeAndIsCompletedFalse(Instant now);
}
