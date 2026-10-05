package com.wristo.modules.seller.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.seller.dto.SellerListingResponse;
import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.SellerListing;
import com.wristo.modules.seller.repository.SellerListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AdminListingService {

    private static final Logger log = LoggerFactory.getLogger(AdminListingService.class);

    private final SellerListingRepository sellerListingRepository;

    public AdminListingService(SellerListingRepository sellerListingRepository) {
        this.sellerListingRepository = sellerListingRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<SellerListingResponse> getAllListings(ListingStatus status, Pageable pageable) {
        Page<SellerListing> page;
        if (status != null) {
            page = sellerListingRepository.findAllByStatus(status, pageable);
        } else {
            page = sellerListingRepository.findAll(pageable);
        }
        return PageResponse.from(page.map(SellerListingResponse::from));
    }

    public SellerListingResponse approveListing(UUID listingId) {
        SellerListing listing = sellerListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SELLER_LISTING_NOT_FOUND, "Seller listing not found: " + listingId));

        listing.setStatus(ListingStatus.ACTIVE);
        listing.setRejectionReason(null);
        listing.setIsActive(true);

        SellerListing updated = sellerListingRepository.save(listing);
        log.info("Admin approved seller listing ID: {}", listingId);
        return SellerListingResponse.from(updated);
    }

    public SellerListingResponse rejectListing(UUID listingId, String reason) {
        SellerListing listing = sellerListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SELLER_LISTING_NOT_FOUND, "Seller listing not found: " + listingId));

        listing.setStatus(ListingStatus.REJECTED);
        listing.setRejectionReason(reason);
        listing.setIsActive(false);

        SellerListing updated = sellerListingRepository.save(listing);
        log.info("Admin rejected seller listing ID: {} with reason: {}", listingId, reason);
        return SellerListingResponse.from(updated);
    }
}
