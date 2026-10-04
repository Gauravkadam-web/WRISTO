package com.wristo.modules.auth.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.auth.dto.UserAddressDto;
import com.wristo.modules.auth.dto.UserProfileResponse;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.entity.UserAddress;
import com.wristo.modules.auth.repository.UserAddressRepository;
import com.wristo.modules.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;

    public UserService(UserRepository userRepository, UserAddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "User profile not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getRole(),
                Boolean.TRUE.equals(user.getIsVerified())
        );
    }

    @Transactional
    public UserProfileResponse updateProfile(UUID userId, String fullName, String phone, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "User profile not found"));

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (phone != null) {
            user.setPhone(phone.trim());
        }
        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl.trim());
        }

        User updated = userRepository.save(user);
        return new UserProfileResponse(
                updated.getId(),
                updated.getEmail(),
                updated.getFullName(),
                updated.getPhone(),
                updated.getAvatarUrl(),
                updated.getRole(),
                Boolean.TRUE.equals(updated.getIsVerified())
        );
    }

    @Transactional(readOnly = true)
    public List<UserAddressDto> getAddresses(UUID userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream()
                .map(UserAddressDto::fromEntity)
                .toList();
    }

    @Transactional
    public UserAddressDto addAddress(UUID userId, UserAddressDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));

        List<UserAddress> existing = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        boolean isFirstAddress = existing.isEmpty();

        UserAddress address = new UserAddress();
        address.setUser(user);
        address.setLabel(dto.getLabel() != null ? dto.getLabel() : "Home");
        address.setRecipientName(dto.getRecipientName());
        address.setPhone(dto.getPhone());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setLandmark(dto.getLandmark());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());
        address.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");

        if (Boolean.TRUE.equals(dto.getIsDefault()) || isFirstAddress) {
            existing.forEach(a -> a.setIsDefault(false));
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }

        UserAddress saved = addressRepository.save(address);
        return UserAddressDto.fromEntity(saved);
    }

    @Transactional
    public UserAddressDto updateAddress(UUID userId, UUID addressId, UserAddressDto dto) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Address not found"));

        address.setLabel(dto.getLabel() != null ? dto.getLabel() : address.getLabel());
        address.setRecipientName(dto.getRecipientName());
        address.setPhone(dto.getPhone());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setLandmark(dto.getLandmark());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPincode(dto.getPincode());
        address.setCountry(dto.getCountry() != null ? dto.getCountry() : address.getCountry());

        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            List<UserAddress> all = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            all.forEach(a -> a.setIsDefault(false));
            address.setIsDefault(true);
        }

        UserAddress updated = addressRepository.save(address);
        return UserAddressDto.fromEntity(updated);
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Address not found"));

        addressRepository.delete(address);
    }

    @Transactional
    public UserAddressDto setDefaultAddress(UUID userId, UUID addressId) {
        List<UserAddress> all = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        UserAddress target = null;

        for (UserAddress a : all) {
            if (a.getId().equals(addressId)) {
                a.setIsDefault(true);
                target = a;
            } else {
                a.setIsDefault(false);
            }
        }

        if (target == null) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Address not found");
        }

        addressRepository.saveAll(all);
        return UserAddressDto.fromEntity(target);
    }
}
