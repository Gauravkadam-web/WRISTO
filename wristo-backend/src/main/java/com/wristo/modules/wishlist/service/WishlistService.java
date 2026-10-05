package com.wristo.modules.wishlist.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.dto.AddToCartRequest;
import com.wristo.modules.cart.dto.CartResponse;
import com.wristo.modules.cart.service.CartService;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.wishlist.dto.ToggleWishlistResponse;
import com.wristo.modules.wishlist.dto.WishlistItemResponse;
import com.wristo.modules.wishlist.dto.WishlistResponse;
import com.wristo.modules.wishlist.entity.Wishlist;
import com.wristo.modules.wishlist.entity.WishlistItem;
import com.wristo.modules.wishlist.repository.WishlistItemRepository;
import com.wristo.modules.wishlist.repository.WishlistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WishlistService {

    private static final Logger log = LoggerFactory.getLogger(WishlistService.class);

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final WatchRepository watchRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public WishlistService(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            WatchRepository watchRepository,
            UserRepository userRepository,
            CartService cartService
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.watchRepository = watchRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }

    @Transactional
    public Wishlist getOrCreateWishlist(UUID userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
            Wishlist wishlist = new Wishlist();
            wishlist.setId(UUID.randomUUID().toString());
            wishlist.setUser(user);
            return wishlistRepository.save(wishlist);
        });
    }

    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(UUID userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return buildWishlistResponse(wishlist);
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(UUID userId, String watchId) {
        return wishlistRepository.findByUserId(userId)
                .map(w -> wishlistItemRepository.existsByWishlistIdAndWatchId(w.getId(), watchId))
                .orElse(false);
    }

    @Transactional
    public ToggleWishlistResponse toggleWishlist(UUID userId, String watchId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        Watch watch = watchRepository.findById(watchId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog"));

        Optional<WishlistItem> itemOpt = wishlistItemRepository.findByWishlistIdAndWatchId(wishlist.getId(), watch.getId());

        if (itemOpt.isPresent()) {
            WishlistItem item = itemOpt.get();
            wishlistItemRepository.delete(item);
            wishlistItemRepository.flush();
            log.info("Removed watch {} from wishlist of user {}", watchId, userId);
            return new ToggleWishlistResponse(watchId, false, false, "Timepiece removed from your vault wishlist.");
        } else {
            WishlistItem item = new WishlistItem();
            item.setId(UUID.randomUUID().toString());
            item.setWishlist(wishlist);
            item.setWatch(watch);
            wishlistItemRepository.saveAndFlush(item);
            log.info("Added watch {} to wishlist of user {}", watchId, userId);
            return new ToggleWishlistResponse(watchId, true, true, "Timepiece saved to your vault wishlist.");
        }
    }

    @Transactional
    public WishlistResponse addItem(UUID userId, String watchId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        Watch watch = watchRepository.findById(watchId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog"));

        if (!wishlistItemRepository.existsByWishlistIdAndWatchId(wishlist.getId(), watch.getId())) {
            WishlistItem item = new WishlistItem();
            item.setId(UUID.randomUUID().toString());
            item.setWishlist(wishlist);
            item.setWatch(watch);
            wishlistItemRepository.saveAndFlush(item);
        }

        return buildWishlistResponse(wishlist);
    }

    @Transactional
    public WishlistResponse removeItem(UUID userId, String watchId) {
        Wishlist wishlist = getOrCreateWishlist(userId);

        wishlistItemRepository.findByWishlistIdAndWatchId(wishlist.getId(), watchId).ifPresent(item -> {
            wishlistItemRepository.delete(item);
            wishlistItemRepository.flush();
        });

        return buildWishlistResponse(wishlist);
    }

    @Transactional
    public WishlistResponse clearWishlist(UUID userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        wishlistItemRepository.deleteByWishlistId(wishlist.getId());
        wishlistItemRepository.flush();
        return buildWishlistResponse(wishlist);
    }

    @Transactional
    public CartResponse moveToCart(UUID userId, String watchId) {
        // 1. Add item to cart
        CartResponse cartResponse = cartService.addItem(userId, null, new AddToCartRequest(watchId, 1));

        // 2. Remove from wishlist
        removeItem(userId, watchId);

        log.info("Moved timepiece {} from wishlist to cart for user {}", watchId, userId);
        return cartResponse;
    }

    private WishlistResponse buildWishlistResponse(Wishlist wishlist) {
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());
        List<WishlistItemResponse> itemResponses = items.stream()
                .map(WishlistItemResponse::from)
                .toList();

        return new WishlistResponse(
                wishlist.getId(),
                itemResponses,
                itemResponses.size()
        );
    }
}
