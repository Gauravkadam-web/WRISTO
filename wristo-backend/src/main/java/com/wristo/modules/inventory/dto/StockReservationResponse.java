package com.wristo.modules.inventory.dto;

import com.wristo.modules.inventory.entity.InventoryReservation;
import com.wristo.modules.inventory.entity.ReservationStatus;

import java.time.Instant;
import java.util.UUID;

public class StockReservationResponse {

    private UUID reservationId;
    private UUID inventoryId;
    private UUID sellerListingId;
    private int quantity;
    private ReservationStatus status;
    private Instant expiresAt;
    private Instant createdAt;

    public StockReservationResponse() {
    }

    public static StockReservationResponse from(InventoryReservation reservation) {
        if (reservation == null) return null;
        StockReservationResponse dto = new StockReservationResponse();
        dto.setReservationId(reservation.getId());
        if (reservation.getInventory() != null) {
            dto.setInventoryId(reservation.getInventory().getId());
            if (reservation.getInventory().getSellerListing() != null) {
                dto.setSellerListingId(reservation.getInventory().getSellerListing().getId());
            }
        }
        dto.setQuantity(reservation.getQuantity());
        dto.setStatus(reservation.getStatus());
        dto.setExpiresAt(reservation.getExpiresAt());
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }

    public UUID getReservationId() { return reservationId; }
    public void setReservationId(UUID reservationId) { this.reservationId = reservationId; }

    public UUID getInventoryId() { return inventoryId; }
    public void setInventoryId(UUID inventoryId) { this.inventoryId = inventoryId; }

    public UUID getSellerListingId() { return sellerListingId; }
    public void setSellerListingId(UUID sellerListingId) { this.sellerListingId = sellerListingId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
