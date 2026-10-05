package com.wristo.modules.inventory.dto;

import com.wristo.modules.inventory.entity.InventoryMovement;
import com.wristo.modules.inventory.entity.MovementType;

import java.time.Instant;
import java.util.UUID;

public class InventoryMovementResponse {

    private UUID id;
    private UUID inventoryId;
    private MovementType movementType;
    private Integer quantity;
    private String referenceId;
    private String reason;
    private String createdBy;
    private Instant createdAt;

    public InventoryMovementResponse() {
    }

    public static InventoryMovementResponse from(InventoryMovement movement) {
        if (movement == null) return null;
        InventoryMovementResponse dto = new InventoryMovementResponse();
        dto.setId(movement.getId());
        if (movement.getInventory() != null) {
            dto.setInventoryId(movement.getInventory().getId());
        }
        dto.setMovementType(movement.getMovementType());
        dto.setQuantity(movement.getQuantity());
        dto.setReferenceId(movement.getReferenceId());
        dto.setReason(movement.getReason());
        dto.setCreatedBy(movement.getCreatedBy());
        dto.setCreatedAt(movement.getCreatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getInventoryId() { return inventoryId; }
    public void setInventoryId(UUID inventoryId) { this.inventoryId = inventoryId; }

    public MovementType getMovementType() { return movementType; }
    public void setMovementType(MovementType movementType) { this.movementType = movementType; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
