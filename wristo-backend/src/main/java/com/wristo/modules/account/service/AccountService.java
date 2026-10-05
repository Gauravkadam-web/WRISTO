package com.wristo.modules.account.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.account.dto.CollectorDashboardResponse;
import com.wristo.modules.account.dto.CollectorProfileResponse;
import com.wristo.modules.account.dto.UpdateCollectorProfileRequest;
import com.wristo.modules.account.entity.CollectorProfile;
import com.wristo.modules.account.entity.Salutation;
import com.wristo.modules.account.repository.CollectorProfileRepository;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserAddressRepository;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.provenance.repository.ProvenanceRecordRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class AccountService {

    private static final Logger log = LoggerFactory.getLogger(AccountService.class);

    private final CollectorProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final ProvenanceRecordRepository provenanceRepository;

    public AccountService(
            CollectorProfileRepository profileRepository,
            UserRepository userRepository,
            UserAddressRepository addressRepository,
            OrderRepository orderRepository,
            ProvenanceRecordRepository provenanceRepository
    ) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.provenanceRepository = provenanceRepository;
    }

    @Transactional(readOnly = true)
    public CollectorProfileResponse getProfile(UserPrincipal principal) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS, "Authentication required to view profile");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "User profile not found"));

        CollectorProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultProfile(user));

        return CollectorProfileResponse.from(user, profile);
    }

    public CollectorProfileResponse updateProfile(UserPrincipal principal, UpdateCollectorProfileRequest request) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS, "Authentication required to update profile");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "User profile not found"));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone().trim());
        }
        final User savedUser = userRepository.save(user);

        CollectorProfile profile = profileRepository.findByUserId(savedUser.getId())
                .orElseGet(() -> new CollectorProfile(savedUser));

        if (request.salutation() != null) {
            try {
                profile.setSalutation(Salutation.valueOf(request.salutation().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore or keep previous
            }
        }
        if (request.wristSizeMm() != null && request.wristSizeMm() > 0) {
            profile.setWristSizeMm(request.wristSizeMm());
        }
        if (request.currency() != null && !request.currency().isBlank()) {
            profile.setCurrency(request.currency().toUpperCase().trim());
        }
        if (request.notifications() != null) {
            if (request.notifications().containsKey("orderTelemetry")) {
                profile.setOrderTelemetry(request.notifications().get("orderTelemetry"));
            }
            if (request.notifications().containsKey("rareAllocations")) {
                profile.setRareAllocations(request.notifications().get("rareAllocations"));
            }
            if (request.notifications().containsKey("conciergeBriefings")) {
                profile.setConciergeBriefings(request.notifications().get("conciergeBriefings"));
            }
        }

        CollectorProfile saved = profileRepository.save(profile);
        log.info("Updated collector profile for user: {}", user.getEmail());
        return CollectorProfileResponse.from(savedUser, saved);
    }

    @Transactional(readOnly = true)
    public CollectorDashboardResponse getDashboard(UserPrincipal principal) {
        CollectorProfileResponse profile = getProfile(principal);

        long vaultCount = provenanceRepository.findByCurrentUserIdAndIsCurrentOwnerTrueOrderByOwnershipStartDateDesc(principal.getId()).size();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(principal.getId(), org.springframework.data.domain.Pageable.unpaged()).getContent();

        long totalOrders = orders.size();
        long activeOrders = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.DELIVERED && o.getStatus() != OrderStatus.CANCELLED)
                .count();

        BigDecimal totalSpend = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long addressCount = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(principal.getId()).size();

        return new CollectorDashboardResponse(
                profile,
                vaultCount,
                totalOrders,
                activeOrders,
                totalSpend,
                addressCount
        );
    }

    private CollectorProfile createDefaultProfile(User user) {
        CollectorProfile profile = new CollectorProfile(user);
        return profileRepository.save(profile);
    }
}
