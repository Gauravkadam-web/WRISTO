package com.wristo.modules.seller.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.seller.dto.*;
import com.wristo.modules.seller.entity.*;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerDocumentRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.modules.seller.repository.SellerUserRepository;
import com.wristo.security.model.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SellerService {

    private final SellerRepository sellerRepository;
    private final SellerUserRepository sellerUserRepository;
    private final SellerDocumentRepository sellerDocumentRepository;
    private final SellerBrandAuthorizationRepository sellerBrandAuthorizationRepository;
    private final UserRepository userRepository;
    private final BrandRepository brandRepository;

    public SellerService(SellerRepository sellerRepository,
                         SellerUserRepository sellerUserRepository,
                         SellerDocumentRepository sellerDocumentRepository,
                         SellerBrandAuthorizationRepository sellerBrandAuthorizationRepository,
                         UserRepository userRepository,
                         BrandRepository brandRepository) {
        this.sellerRepository = sellerRepository;
        this.sellerUserRepository = sellerUserRepository;
        this.sellerDocumentRepository = sellerDocumentRepository;
        this.sellerBrandAuthorizationRepository = sellerBrandAuthorizationRepository;
        this.userRepository = userRepository;
        this.brandRepository = brandRepository;
    }

    public SellerResponse onboardSeller(UserPrincipal currentUser, SellerOnboardRequest request) {
        if (sellerRepository.existsByGstin(request.getGstin().toUpperCase())) {
            throw new BusinessException(ErrorCode.SELLER_ALREADY_EXISTS, "A seller boutique with GSTIN " + request.getGstin() + " is already registered");
        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        List<SellerUser> existingStaff = sellerUserRepository.findByUserId(user.getId());
        if (!existingStaff.isEmpty()) {
            throw new BusinessException(ErrorCode.SELLER_ALREADY_EXISTS, "This user account is already affiliated with a seller organization");
        }

        String baseSlug = "seller-" + request.getBusinessName()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (baseSlug.length() > 26) {
            baseSlug = baseSlug.substring(0, 26);
        }

        String sellerId = baseSlug;
        if (sellerRepository.existsById(sellerId)) {
            sellerId = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 4);
        }

        Seller seller = new Seller(
                sellerId,
                request.getBusinessName().trim(),
                request.getLegalEntityName().trim(),
                request.getGstin().trim().toUpperCase(),
                request.getPan().trim().toUpperCase(),
                request.getBankAccountNumber().trim(),
                request.getIfscCode().trim().toUpperCase()
        );
        seller = sellerRepository.save(seller);

        SellerUser sellerUser = new SellerUser(seller, user, SellerStaffRole.OWNER, true);
        sellerUserRepository.save(sellerUser);

        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            user.setRole("SELLER");
            userRepository.save(user);
        }

        if (request.getDocuments() != null && !request.getDocuments().isEmpty()) {
            for (DocumentUploadRequest docReq : request.getDocuments()) {
                SellerDocument doc = new SellerDocument(seller, docReq.getDocumentType(), docReq.getDocumentUrl());
                sellerDocumentRepository.save(doc);
            }
        }

        return mapToResponse(seller);
    }

    @Transactional(readOnly = true)
    public SellerResponse getMySellerProfile(UserPrincipal currentUser) {
        Seller seller = getSellerForUser(currentUser.getId());
        return mapToResponse(seller);
    }

    public SellerResponse updateMySellerProfile(UserPrincipal currentUser, SellerOnboardRequest request) {
        Seller seller = getSellerForUser(currentUser.getId());
        verifyStaffPermission(seller.getId(), currentUser.getId(), SellerStaffRole.OWNER, SellerStaffRole.ADMIN);

        seller.setBusinessName(request.getBusinessName().trim());
        seller.setLegalEntityName(request.getLegalEntityName().trim());
        seller.setPan(request.getPan().trim().toUpperCase());
        seller.setBankAccountNumber(request.getBankAccountNumber().trim());
        seller.setIfscCode(request.getIfscCode().trim().toUpperCase());

        Seller updated = sellerRepository.save(seller);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<SellerStaffResponse> getStaff(UserPrincipal currentUser) {
        Seller seller = getSellerForUser(currentUser.getId());
        return sellerUserRepository.findBySellerId(seller.getId()).stream()
                .map(this::mapToStaffResponse)
                .collect(Collectors.toList());
    }

    public SellerStaffResponse addStaff(UserPrincipal currentUser, SellerStaffRequest request) {
        Seller seller = getSellerForUser(currentUser.getId());
        verifyStaffPermission(seller.getId(), currentUser.getId(), SellerStaffRole.OWNER, SellerStaffRole.ADMIN);

        User targetUser = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        if (sellerUserRepository.existsBySellerIdAndUserId(seller.getId(), targetUser.getId())) {
            throw new BusinessException(ErrorCode.SELLER_STAFF_ALREADY_EXISTS, "User is already affiliated with this seller boutique");
        }

        SellerUser newStaff = new SellerUser(seller, targetUser, request.getRole(), Boolean.TRUE.equals(request.getIsPrimary()));
        newStaff = sellerUserRepository.save(newStaff);

        if ("CUSTOMER".equalsIgnoreCase(targetUser.getRole())) {
            targetUser.setRole("SELLER_STAFF");
            userRepository.save(targetUser);
        }

        return mapToStaffResponse(newStaff);
    }

    public void removeStaff(UserPrincipal currentUser, UUID staffUserId) {
        Seller seller = getSellerForUser(currentUser.getId());
        verifyStaffPermission(seller.getId(), currentUser.getId(), SellerStaffRole.OWNER, SellerStaffRole.ADMIN);

        SellerUser staffMember = sellerUserRepository.findBySellerIdAndUserId(seller.getId(), staffUserId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SELLER_STAFF_NOT_FOUND, "Staff member not found in your seller boutique"));

        if (Boolean.TRUE.equals(staffMember.getIsPrimary())) {
            throw new BusinessException(ErrorCode.FORBIDDEN_OPERATION, "Primary boutique owner cannot be removed");
        }

        sellerUserRepository.delete(staffMember);
    }

    public SellerResponse.SellerDocumentDto uploadDocument(UserPrincipal currentUser, DocumentUploadRequest request) {
        Seller seller = getSellerForUser(currentUser.getId());
        SellerDocument doc = new SellerDocument(seller, request.getDocumentType(), request.getDocumentUrl());
        SellerDocument saved = sellerDocumentRepository.save(doc);
        return new SellerResponse.SellerDocumentDto(
                saved.getId(),
                saved.getDocumentType(),
                saved.getDocumentUrl(),
                saved.getVerificationStatus(),
                saved.getCreatedAt()
        );
    }

    public SellerResponse.SellerBrandAuthDto requestBrandAuthorization(UserPrincipal currentUser, BrandAuthorizationRequest request) {
        Seller seller = getSellerForUser(currentUser.getId());

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getBrandId()));

        if (sellerBrandAuthorizationRepository.existsBySellerIdAndBrandId(seller.getId(), brand.getId())) {
            throw new BusinessException(ErrorCode.BRAND_AUTHORIZATION_ALREADY_EXISTS, "Brand authorization request already submitted for " + brand.getName());
        }

        SellerBrandAuthorization auth = new SellerBrandAuthorization(seller, brand, request.getAuthorizationDocUrl());
        SellerBrandAuthorization saved = sellerBrandAuthorizationRepository.save(auth);

        return new SellerResponse.SellerBrandAuthDto(
                saved.getId(),
                brand.getId(),
                brand.getName(),
                saved.getAuthorizationDocUrl(),
                saved.getStatus(),
                saved.getCreatedAt()
        );
    }

    public Seller getSellerForUser(UUID userId) {
        List<SellerUser> list = sellerUserRepository.findByUserId(userId);
        if (list.isEmpty()) {
            throw new BusinessException(ErrorCode.SELLER_NOT_FOUND, "No affiliated seller organization found for the current user");
        }
        return list.get(0).getSeller();
    }

    private void verifyStaffPermission(String sellerId, UUID userId, SellerStaffRole... allowedRoles) {
        SellerUser staff = sellerUserRepository.findBySellerIdAndUserId(sellerId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.FORBIDDEN_OPERATION, "User not authorized for this seller organization"));

        for (SellerStaffRole role : allowedRoles) {
            if (staff.getRole() == role) {
                return;
            }
        }
        throw new BusinessException(ErrorCode.FORBIDDEN_OPERATION, "Insufficient boutique staff permissions for this operation");
    }

    public SellerResponse mapToResponse(Seller seller) {
        SellerResponse response = new SellerResponse();
        response.setId(seller.getId());
        response.setBusinessName(seller.getBusinessName());
        response.setLegalEntityName(seller.getLegalEntityName());
        response.setGstin(seller.getGstin());
        response.setPan(seller.getPan());
        response.setBankAccountNumber(seller.getBankAccountNumber());
        response.setIfscCode(seller.getIfscCode());
        response.setStatus(seller.getStatus());
        response.setRejectionReason(seller.getRejectionReason());
        response.setCommissionRate(seller.getCommissionRate());
        response.setRating(seller.getRating());
        response.setIsActive(seller.getIsActive());
        response.setCreatedAt(seller.getCreatedAt());
        response.setUpdatedAt(seller.getUpdatedAt());

        List<SellerDocument> docs = sellerDocumentRepository.findBySellerId(seller.getId());
        response.setDocuments(docs.stream()
                .map(d -> new SellerResponse.SellerDocumentDto(d.getId(), d.getDocumentType(), d.getDocumentUrl(), d.getVerificationStatus(), d.getCreatedAt()))
                .collect(Collectors.toList()));

        List<SellerBrandAuthorization> brandAuths = sellerBrandAuthorizationRepository.findBySellerId(seller.getId());
        response.setBrandAuthorizations(brandAuths.stream()
                .map(a -> new SellerResponse.SellerBrandAuthDto(a.getId(), a.getBrand().getId(), a.getBrand().getName(), a.getAuthorizationDocUrl(), a.getStatus(), a.getCreatedAt()))
                .collect(Collectors.toList()));

        List<SellerUser> staffList = sellerUserRepository.findBySellerId(seller.getId());
        response.setStaff(staffList.stream()
                .map(this::mapToStaffResponse)
                .collect(Collectors.toList()));

        return response;
    }

    private SellerStaffResponse mapToStaffResponse(SellerUser su) {
        return new SellerStaffResponse(
                su.getId(),
                su.getUser().getId(),
                su.getUser().getEmail(),
                su.getUser().getFullName(),
                su.getRole(),
                su.getIsPrimary(),
                su.getCreatedAt()
        );
    }
}
