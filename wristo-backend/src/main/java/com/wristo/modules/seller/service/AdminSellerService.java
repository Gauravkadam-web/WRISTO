package com.wristo.modules.seller.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.seller.dto.SellerResponse;
import com.wristo.modules.seller.dto.SellerStatusUpdateRequest;
import com.wristo.modules.seller.entity.*;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerDocumentRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AdminSellerService {

    private final SellerRepository sellerRepository;
    private final SellerDocumentRepository sellerDocumentRepository;
    private final SellerBrandAuthorizationRepository sellerBrandAuthorizationRepository;
    private final SellerService sellerService;

    public AdminSellerService(SellerRepository sellerRepository,
                              SellerDocumentRepository sellerDocumentRepository,
                              SellerBrandAuthorizationRepository sellerBrandAuthorizationRepository,
                              SellerService sellerService) {
        this.sellerRepository = sellerRepository;
        this.sellerDocumentRepository = sellerDocumentRepository;
        this.sellerBrandAuthorizationRepository = sellerBrandAuthorizationRepository;
        this.sellerService = sellerService;
    }

    @Transactional(readOnly = true)
    public PageResponse<SellerResponse> getAllSellers(SellerStatus status, Pageable pageable) {
        Page<Seller> page;
        if (status != null) {
            page = sellerRepository.findAllByStatus(status, pageable);
        } else {
            page = sellerRepository.findAll(pageable);
        }

        Page<SellerResponse> mappedPage = page.map(sellerService::mapToResponse);
        return PageResponse.from(mappedPage);
    }

    @Transactional(readOnly = true)
    public SellerResponse getSellerById(String sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId));
        return sellerService.mapToResponse(seller);
    }

    public SellerResponse updateSellerStatus(String sellerId, SellerStatusUpdateRequest request) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId));

        seller.setStatus(request.getStatus());
        if (request.getRejectionReason() != null) {
            seller.setRejectionReason(request.getRejectionReason());
        }
        if (request.getCommissionRate() != null) {
            seller.setCommissionRate(request.getCommissionRate());
        }

        Seller saved = sellerRepository.save(seller);
        return sellerService.mapToResponse(saved);
    }

    public SellerResponse.SellerDocumentDto verifyDocument(String sellerId, UUID documentId, DocumentVerificationStatus status) {
        SellerDocument doc = sellerDocumentRepository.findByIdAndSellerId(documentId, sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("SellerDocument", "id", documentId));

        doc.setVerificationStatus(status);
        SellerDocument saved = sellerDocumentRepository.save(doc);

        return new SellerResponse.SellerDocumentDto(
                saved.getId(),
                saved.getDocumentType(),
                saved.getDocumentUrl(),
                saved.getVerificationStatus(),
                saved.getCreatedAt()
        );
    }

    public SellerResponse.SellerBrandAuthDto verifyBrandAuthorization(String sellerId, UUID authId, BrandAuthStatus status) {
        SellerBrandAuthorization auth = sellerBrandAuthorizationRepository.findByIdAndSellerId(authId, sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("SellerBrandAuthorization", "id", authId));

        auth.setStatus(status);
        SellerBrandAuthorization saved = sellerBrandAuthorizationRepository.save(auth);

        return new SellerResponse.SellerBrandAuthDto(
                saved.getId(),
                saved.getBrand().getId(),
                saved.getBrand().getName(),
                saved.getAuthorizationDocUrl(),
                saved.getStatus(),
                saved.getCreatedAt()
        );
    }
}
