package com.wristo.modules.cart.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.dto.*;
import com.wristo.modules.cart.entity.Cart;
import com.wristo.modules.cart.entity.CartItem;
import com.wristo.modules.cart.repository.CartItemRepository;
import com.wristo.modules.cart.repository.CartRepository;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.coupon.dto.CouponResponse;
import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.service.CouponService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    private static final Logger log = LoggerFactory.getLogger(CartService.class);

    private static final BigDecimal GIFT_WRAP_FEE = new BigDecimal("500.00");
    private static final BigDecimal WHITE_GLOVE_DELIVERY_FEE = new BigDecimal("1500.00");
    private static final BigDecimal GIFT_POUCH_THRESHOLD = new BigDecimal("15000.00");

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final WatchRepository watchRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            WatchRepository watchRepository,
            UserRepository userRepository,
            CouponService couponService
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.watchRepository = watchRepository;
        this.userRepository = userRepository;
        this.couponService = couponService;
    }

    @Transactional
    public Cart getOrCreateCart(UUID userId, String sessionId) {
        if (userId != null) {
            Optional<Cart> userCart = cartRepository.findByUserId(userId);
            if (userCart.isPresent()) {
                return userCart.get();
            }

            // If user previously had a guest session cart, associate it
            if (sessionId != null && !sessionId.isBlank()) {
                Optional<Cart> guestCart = cartRepository.findBySessionId(sessionId);
                if (guestCart.isPresent()) {
                    Cart cart = guestCart.get();
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
                    cart.setUser(user);
                    cart.setSessionId(null);
                    return cartRepository.save(cart);
                }
            }

            // Create new cart for authenticated user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
            Cart cart = new Cart();
            cart.setId(UUID.randomUUID().toString());
            cart.setUser(user);
            cart.setIsGiftWrapped(false);
            cart.setDeliveryTier("insured_express");
            return cartRepository.save(cart);
        }

        if (sessionId != null && !sessionId.isBlank()) {
            return cartRepository.findBySessionId(sessionId).orElseGet(() -> {
                Cart cart = new Cart();
                cart.setId(UUID.randomUUID().toString());
                cart.setSessionId(sessionId);
                cart.setIsGiftWrapped(false);
                cart.setDeliveryTier("insured_express");
                return cartRepository.save(cart);
            });
        }

        // Generate ephemeral session cart
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID().toString());
        cart.setSessionId("guest-" + UUID.randomUUID());
        cart.setIsGiftWrapped(false);
        cart.setDeliveryTier("insured_express");
        return cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId, String sessionId) {
        Cart cart = getOrCreateCart(userId, sessionId);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(UUID userId, String sessionId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId, sessionId);

        Watch watch = watchRepository.findById(request.watchId())
                .orElseThrow(() -> new BusinessException(ErrorCode.WATCH_NOT_FOUND, "Timepiece not found in catalog"));

        if (!Boolean.TRUE.equals(watch.getIsActive())) {
            throw new BusinessException(ErrorCode.WATCH_NOT_FOUND, "This timepiece is currently unavailable");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndWatchId(cart.getId(), watch.getId());
        int targetQuantity = request.quantity();

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            targetQuantity += existing.getQuantity();

            if (watch.getStockCount() != null && targetQuantity > watch.getStockCount()) {
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK_FOR_CART,
                        String.format("Only %d units available for %s %s", watch.getStockCount(), watch.getBrandName(), watch.getModel()));
            }

            existing.setQuantity(targetQuantity);
            existing.setUnitPrice(watch.getPrice());
            cartItemRepository.save(existing);
        } else {
            if (watch.getStockCount() != null && targetQuantity > watch.getStockCount()) {
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK_FOR_CART,
                        String.format("Only %d units available for %s %s", watch.getStockCount(), watch.getBrandName(), watch.getModel()));
            }

            CartItem item = new CartItem();
            item.setId(UUID.randomUUID().toString());
            item.setCart(cart);
            item.setWatch(watch);
            item.setQuantity(targetQuantity);
            item.setUnitPrice(watch.getPrice());
            cartItemRepository.save(item);
        }

        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(UUID userId, String sessionId, String itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId, sessionId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND, "Item not found in shopping cart"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND, "Item does not belong to active cart");
        }

        Watch watch = item.getWatch();
        if (watch.getStockCount() != null && request.quantity() > watch.getStockCount()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK_FOR_CART,
                    String.format("Only %d units available for %s %s", watch.getStockCount(), watch.getBrandName(), watch.getModel()));
        }

        item.setQuantity(request.quantity());
        item.setUnitPrice(watch.getPrice());
        cartItemRepository.save(item);

        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(UUID userId, String sessionId, String itemId) {
        Cart cart = getOrCreateCart(userId, sessionId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND, "Item not found in shopping cart"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND, "Item does not belong to active cart");
        }

        cartItemRepository.delete(item);
        cartItemRepository.flush();

        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse clearCart(UUID userId, String sessionId) {
        Cart cart = getOrCreateCart(userId, sessionId);
        cartItemRepository.deleteByCartId(cart.getId());
        cartItemRepository.flush();
        cart.setAppliedCoupon(null);
        cart.setIsGiftWrapped(false);
        cart.setGiftMessage(null);
        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse applyCoupon(UUID userId, String sessionId, ApplyCouponRequest request) {
        Cart cart = getOrCreateCart(userId, sessionId);
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        BigDecimal subtotal = calculateSubtotal(items);
        Coupon coupon = couponService.getCouponEntity(request.code());

        if (coupon == null) {
            throw new BusinessException(ErrorCode.COUPON_NOT_FOUND,
                    "\"" + request.code() + "\" is not a valid horological promo code.");
        }

        if (coupon.getMinSubtotal() != null && subtotal.compareTo(coupon.getMinSubtotal()) < 0) {
            throw new BusinessException(ErrorCode.COUPON_MIN_SUBTOTAL_NOT_MET,
                    String.format("Code \"%s\" requires a minimum order value of ₹%,.0f.",
                            coupon.getCode(), coupon.getMinSubtotal()));
        }

        cart.setAppliedCoupon(coupon);
        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse removeCoupon(UUID userId, String sessionId) {
        Cart cart = getOrCreateCart(userId, sessionId);
        cart.setAppliedCoupon(null);
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse updateGiftOptions(UUID userId, String sessionId, CartGiftOptionRequest request) {
        Cart cart = getOrCreateCart(userId, sessionId);
        cart.setIsGiftWrapped(request.isGiftWrapped());
        cart.setGiftMessage(request.giftMessage());
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse updateDeliveryOption(UUID userId, String sessionId, CartDeliveryOptionRequest request) {
        Cart cart = getOrCreateCart(userId, sessionId);
        String tier = request.deliveryTier() != null ? request.deliveryTier() : "insured_express";
        cart.setDeliveryTier(tier);
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Transactional(readOnly = true)
    public OrderTotalsResponse calculateStatelessTotals(CalculateTotalsRequest request) {
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItemInput input : request.items()) {
            Watch watch = watchRepository.findById(input.watchId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.WATCH_NOT_FOUND, "Watch ID " + input.watchId() + " not found"));
            subtotal = subtotal.add(watch.getPrice().multiply(BigDecimal.valueOf(input.quantity())));
        }

        Coupon coupon = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            coupon = couponService.getCouponEntity(request.couponCode());
        }

        boolean isGiftWrapped = Boolean.TRUE.equals(request.isGiftWrapped());
        String deliveryTier = request.deliveryTier() != null ? request.deliveryTier() : "insured_express";

        return computeOrderTotals(subtotal, coupon, isGiftWrapped, deliveryTier);
    }

    public CartResponse buildCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemResponse> itemResponses = items.stream()
                .map(CartItemResponse::from)
                .toList();

        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();
        BigDecimal subtotal = calculateSubtotal(items);

        OrderTotalsResponse totals = computeOrderTotals(
                subtotal,
                cart.getAppliedCoupon(),
                Boolean.TRUE.equals(cart.getIsGiftWrapped()),
                cart.getDeliveryTier()
        );

        return new CartResponse(
                cart.getId(),
                itemResponses,
                totalItems,
                cart.getIsGiftWrapped(),
                cart.getGiftMessage(),
                cart.getDeliveryTier(),
                totals
        );
    }

    private BigDecimal calculateSubtotal(List<CartItem> items) {
        return items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private OrderTotalsResponse computeOrderTotals(
            BigDecimal subtotal,
            Coupon coupon,
            boolean isGiftWrapped,
            String deliveryTier
    ) {
        BigDecimal discount = couponService.calculateDiscount(coupon, subtotal);
        CouponResponse appliedCouponResponse = coupon != null ? CouponResponse.from(coupon) : null;

        BigDecimal giftWrapFee = isGiftWrapped ? GIFT_WRAP_FEE : BigDecimal.ZERO;

        BigDecimal shippingFee = ("white_glove".equalsIgnoreCase(deliveryTier) || "EXPRESS".equalsIgnoreCase(deliveryTier))
                ? WHITE_GLOVE_DELIVERY_FEE
                : BigDecimal.ZERO;

        BigDecimal taxAmount = subtotal.multiply(BigDecimal.valueOf(0.18)).setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = subtotal.subtract(discount).max(BigDecimal.ZERO)
                .add(giftWrapFee)
                .add(shippingFee)
                .add(taxAmount)
                .setScale(2, RoundingMode.HALF_UP);

        boolean giftPouchUnlocked = subtotal.compareTo(GIFT_POUCH_THRESHOLD) >= 0;
        String deliveryDescription = ("white_glove".equalsIgnoreCase(deliveryTier) || "EXPRESS".equalsIgnoreCase(deliveryTier))
                ? "White-Glove Hand Courier with personalized horologist inspection."
                : "Complimentary Insured Air Express in armored tamper-evident case.";
        String estimatedDelivery = ("white_glove".equalsIgnoreCase(deliveryTier) || "EXPRESS".equalsIgnoreCase(deliveryTier))
                ? "1–2 Business Days"
                : "2–3 Business Days";

        return new OrderTotalsResponse(
                subtotal,
                discount,
                giftWrapFee,
                shippingFee,
                taxAmount,
                totalAmount,
                appliedCouponResponse,
                giftPouchUnlocked,
                true,
                deliveryTier,
                deliveryDescription,
                estimatedDelivery
        );
    }
}
