package com.wristo.modules.auth.dto;

import com.wristo.modules.auth.entity.UserAddress;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class UserAddressDto {

    private UUID id;
    private String label = "Home";

    @NotBlank(message = "Recipient name is required")
    private String recipientName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;

    private String addressLine2;
    private String landmark;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String country = "India";
    private Boolean isDefault = false;

    public UserAddressDto() {
    }

    public static UserAddressDto fromEntity(UserAddress address) {
        UserAddressDto dto = new UserAddressDto();
        dto.setId(address.getId());
        dto.setLabel(address.getLabel());
        dto.setRecipientName(address.getRecipientName());
        dto.setPhone(address.getPhone());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setLandmark(address.getLandmark());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPincode(address.getPincode());
        dto.setCountry(address.getCountry());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean aDefault) {
        isDefault = aDefault;
    }
}
