package com.wristo.modules.inventory.repository;

import com.wristo.modules.inventory.entity.InventoryReservation;
import com.wristo.modules.inventory.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryReservationRepository extends JpaRepository<InventoryReservation, UUID> {

    List<InventoryReservation> findAllByInventoryIdAndStatus(UUID inventoryId, ReservationStatus status);

    List<InventoryReservation> findAllByStatusAndExpiresAtBefore(ReservationStatus status, Instant now);
}
