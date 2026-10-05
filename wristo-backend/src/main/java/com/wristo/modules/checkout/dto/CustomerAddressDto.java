package com.wristo.modules.checkout.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CustomerAddressDto(
        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Email address is required")
        String email,

        @NotBlank(message = "Phone number is required")
        String phone,

        @NotBlank(message = "PIN code is required")
        @Pattern(regexp = "^[0-9]{6}$", message = "PIN code must be a valid 6-digit Indian postal code")
        String pincode,

        @NotBlank(message = "Address line 1 is required")
        String addressLine1,

        String addressLine2,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        String state,

        String landmark,

        String deliveryNotes
) {
}
