package com.wristo.modules.inventory.repository;

import com.wristo.modules.inventory.entity.InventoryMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, UUID> {

    List<InventoryMovement> findAllByInventoryIdOrderByCreatedAtDesc(UUID inventoryId);

    Page<InventoryMovement> findAllByInventoryIdOrderByCreatedAtDesc(UUID inventoryId, Pageable pageable);
}
