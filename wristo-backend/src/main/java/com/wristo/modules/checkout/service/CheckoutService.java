package com.wristo.modules.checkout.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.cart.dto.CalculateTotalsRequest;
import com.wristo.modules.cart.dto.CartItemInput;
import com.wristo.modules.cart.dto.OrderTotalsResponse;
import com.wristo.modules.cart.service.CartService;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.checkout.dto.CompleteCheckoutRequest;
import com.wristo.modules.checkout.dto.InitiateCheckoutRequest;
import com.wristo.modules.checkout.dto.InitiateCheckoutResponse;
import com.wristo.modules.checkout.entity.CheckoutSession;
import com.wristo.modules.checkout.repository.CheckoutSessionRepository;
import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.service.CouponService;
import com.wristo.modules.inventory.dto.StockReservationResponse;
import com.wristo.modules.inventory.service.InventoryService;
import com.wristo.modules.order.dto.OrderResponse;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderItem;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.OrderStatusHistory;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.entity.PaymentGatewayType;
import com.wristo.modules.payment.service.PaymentService;
import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.SellerListing;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CheckoutService {

    private static final Logger log = LoggerFactory.getLogger(CheckoutService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final CheckoutSessionRepository checkoutSessionRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final CartService cartService;
    private final CouponService couponService;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    private final WatchRepository watchRepository;
    private final SellerListingRepository sellerListingRepository;
    private final UserRepository userRepository;
    private final com.wristo.modules.provenance.service.CertificateService certificateService;
    private final com.wristo.modules.provenance.service.ProvenanceService provenanceService;
    private final com.wristo.modules.notification.service.NotificationPublisherService notificationPublisherService;

    public CheckoutService(
            CheckoutSessionRepository checkoutSessionRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            CartService cartService,
            CouponService couponService,
            InventoryService inventoryService,
            PaymentService paymentService,
            WatchRepository watchRepository,
            SellerListingRepository sellerListingRepository,
            UserRepository userRepository,
            com.wristo.modules.provenance.service.CertificateService certificateService,
            com.wristo.modules.provenance.service.ProvenanceService provenanceService,
            com.wristo.modules.notification.service.NotificationPublisherService notificationPublisherService
    ) {
        this.checkoutSessionRepository = checkoutSessionRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.cartService = cartService;
        this.couponService = couponService;
        this.inventoryService = inventoryService;
        this.paymentService = paymentService;
        this.watchRepository = watchRepository;
        this.sellerListingRepository = sellerListingRepository;
        this.userRepository = userRepository;
        this.certificateService = certificateService;
        this.provenanceService = provenanceService;
        this.notificationPublisherService = notificationPublisherService;
    }

    public InitiateCheckoutResponse initiateCheckout(
            UserPrincipal principal,
            String clientSessionId,
            InitiateCheckoutRequest request
    ) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST_DATA, "Cannot initiate checkout with empty items list");
        }

        UUID userId = principal != null ? principal.getId() : null;
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        // 1. Calculate totals
        var totalsRequest = new CalculateTotalsRequest(
                request.items(),
                request.couponCode(),
                request.deliveryTier() != null ? request.deliveryTier() : "insured_express",
                Boolean.TRUE.equals(request.isGiftWrapped())
        );
        OrderTotalsResponse totals = cartService.calculateStatelessTotals(totalsRequest);

        // 2. Reserve stock (15-minute hold) for each item
        List<String> reservationIds = new ArrayList<>();
        try {
            for (CartItemInput item : request.items()) {
                UUID listingId = resolveListingId(item.watchId());
                if (listingId != null) {
                    StockReservationResponse reservation = inventoryService.reserveStock(
                            listingId,
                            userId,
                            item.quantity(),
                            15
                    );
                    reservationIds.add(reservation.getReservationId().toString());
                }
            }
        } catch (Exception e) {
            // Release any partial reservations if stock reservation fails
            for (String resIdStr : reservationIds) {
                try {
                    inventoryService.releaseReservation(UUID.fromString(resIdStr));
                } catch (Exception ignored) {
                }
            }
            throw new BusinessException(ErrorCode.CHECKOUT_INSUFFICIENT_STOCK,
                    "Stock hold failed: " + e.getMessage());
        }

        // 3. Create Checkout Session
        CheckoutSession session = new CheckoutSession();
        session.setId("chk_sess_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        session.setUser(user);
        session.setSessionId(clientSessionId);
        session.setReservationIds(String.join(",", reservationIds));
        session.setCouponCode(request.couponCode());
        session.setDeliveryTier(request.deliveryTier() != null ? request.deliveryTier() : "insured_express");
        session.setIsGiftWrapped(Boolean.TRUE.equals(request.isGiftWrapped()));
        session.setGiftMessage(request.giftMessage());
        session.setExpiresAt(Instant.now().plus(Duration.ofMinutes(15)));
        session.setIsCompleted(false);

        CheckoutSession savedSession = checkoutSessionRepository.save(session);
        log.info("Initiated luxury checkout session {} for user {}", savedSession.getId(), userId);

        return new InitiateCheckoutResponse(
                savedSession.getId(),
                savedSession.getExpiresAt(),
                totals,
                "Stock locked in luxury escrow for 15 minutes. Proceed to payment."
        );
    }

    public OrderResponse completeCheckout(
            UserPrincipal principal,
            String clientSessionId,
            CompleteCheckoutRequest request
    ) {
        UUID userId = principal != null ? principal.getId() : null;
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        CheckoutSession session = null;
        if (request.checkoutSessionId() != null && !request.checkoutSessionId().isBlank()) {
            session = checkoutSessionRepository.findById(request.checkoutSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CHECKOUT_SESSION_EXPIRED,
                            "Checkout session not found or expired"));

            if (session.isExpired()) {
                throw new BusinessException(ErrorCode.CHECKOUT_SESSION_EXPIRED,
                        "Checkout session has expired. Please review your cart and retry.");
            }
            if (Boolean.TRUE.equals(session.getIsCompleted())) {
                throw new BusinessException(ErrorCode.INVALID_REQUEST_DATA,
                        "This checkout session has already been completed.");
            }
        }

        // Determine effective coupon, delivery tier, gift options
        String couponCode = session != null && session.getCouponCode() != null ? session.getCouponCode() : request.couponCode();
        String deliveryTier = session != null && session.getDeliveryTier() != null ? session.getDeliveryTier() : (request.deliveryTier() != null ? request.deliveryTier() : "insured_express");
        boolean isGiftWrapped = session != null ? Boolean.TRUE.equals(session.getIsGiftWrapped()) : Boolean.TRUE.equals(request.isGiftWrapped());
        String giftMessage = session != null ? session.getGiftMessage() : request.giftMessage();

        // 1. Gather items from request or session
        List<CartItemInput> items = request.items();
        if ((items == null || items.isEmpty()) && session == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST_DATA, "No items provided for checkout completion");
        }

        // 2. Compute finalized totals
        OrderTotalsResponse totals = cartService.calculateStatelessTotals(
                new CalculateTotalsRequest(items, couponCode, deliveryTier, isGiftWrapped)
        );

        // 3. Generate unique serialized credentials
        String orderId = "ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String orderNumber = "WRT-2026-" + (10000 + RANDOM.nextInt(90000));
        String certificateNumber = "CERT-CHRONO-" + (100000 + RANDOM.nextInt(900000));

        // Ensure uniqueness
        while (orderRepository.existsByOrderNumber(orderNumber)) {
            orderNumber = "WRT-2026-" + (10000 + RANDOM.nextInt(90000));
        }
        while (orderRepository.existsByCertificateNumber(certificateNumber)) {
            certificateNumber = "CERT-CHRONO-" + (100000 + RANDOM.nextInt(900000));
        }

        // 4. Confirm or complete inventory reservations
        if (session != null && session.getReservationIds() != null && !session.getReservationIds().isBlank()) {
            String[] resIds = session.getReservationIds().split(",");
            for (String resIdStr : resIds) {
                if (!resIdStr.isBlank()) {
                    try {
                        inventoryService.completeReservation(UUID.fromString(resIdStr.trim()), orderNumber);
                    } catch (Exception e) {
                        log.warn("Could not complete reservation {}: {}", resIdStr, e.getMessage());
                    }
                }
            }
        }

        // 5. Build Order Entity
        PaymentMethod paymentMethod = request.paymentMethod() != null ? request.paymentMethod() : PaymentMethod.CARD;
        OrderStatus initialStatus = OrderStatus.CONFIRMED;
        PaymentStatus initialPaymentStatus = paymentMethod == PaymentMethod.COD ? PaymentStatus.UNPAID : PaymentStatus.PAID;

        Coupon coupon = couponService.getCouponEntity(couponCode);

        Order order = new Order();
        order.setId(orderId);
        order.setOrderNumber(orderNumber);
        order.setCertificateNumber(certificateNumber);
        order.setUser(user);
        order.setCustomerName(request.address().fullName());
        order.setCustomerEmail(request.address().email());
        order.setCustomerPhone(request.address().phone());
        order.setShippingAddressLine1(request.address().addressLine1());
        order.setShippingAddressLine2(request.address().addressLine2());
        order.setShippingLandmark(request.address().landmark());
        order.setShippingCity(request.address().city());
        order.setShippingState(request.address().state());
        order.setShippingPincode(request.address().pincode());
        order.setShippingCountry("India");
        order.setDeliveryTier(deliveryTier);
        order.setDeliveryNotes(request.address().deliveryNotes());
        order.setIsGiftWrapped(isGiftWrapped);
        order.setGiftMessage(giftMessage);
        order.setCoupon(coupon);
        order.setCouponCode(couponCode);
        order.setSubtotalAmount(totals.subtotal());
        order.setDiscountAmount(totals.discount());
        order.setGiftWrapFee(totals.giftWrapFee());
        order.setShippingFee(totals.shippingFee());
        order.setTaxAmount(totals.taxAmount());
        order.setTotalAmount(totals.totalAmount());
        order.setCurrency("INR");
        order.setStatus(initialStatus);
        order.setPaymentStatus(initialPaymentStatus);
        order.setPaymentMethod(paymentMethod);
        order.setPlacedAt(Instant.now());
        order.setCourierPartner("insured_express".equalsIgnoreCase(deliveryTier)
                ? "BlueDart Apex Luxury"
                : "Boutique Armored Courier");

        Order savedOrder = orderRepository.save(order);

        // 6. Save Order Items
        List<OrderItem> orderItems = new ArrayList<>();
        if (items != null) {
            for (CartItemInput itemInput : items) {
                Watch watch = cartService.findWatch(itemInput.watchId());

                List<SellerListing> offers = sellerListingRepository.findActiveOffersForWatch(watch.getId(), ListingStatus.ACTIVE);
                SellerListing listing = !offers.isEmpty() ? offers.get(0) : null;

                OrderItem orderItem = new OrderItem();
                orderItem.setId("item_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
                orderItem.setOrder(savedOrder);
                orderItem.setWatch(watch);
                orderItem.setSeller(listing != null ? listing.getSeller() : null);
                orderItem.setSellerListing(listing);
                orderItem.setWatchModel(watch.getModel());
                orderItem.setWatchBrand(watch.getBrandName());
                orderItem.setWatchImageUrl(watch.getImageUrl());
                orderItem.setMovementType(watch.getMovement());
                orderItem.setCaseSize(watch.getCaseSize());
                orderItem.setQuantity(itemInput.quantity());
                orderItem.setUnitPrice(watch.getPrice());
                orderItem.setTotalPrice(watch.getPrice().multiply(BigDecimal.valueOf(itemInput.quantity())));

                orderItems.add(orderItemRepository.save(orderItem));
            }
        }

        savedOrder.setItems(orderItems);

        // 6b. Issue Authenticity Certificates & Record Provenance Ledger
        boolean isFirstItem = true;
        for (OrderItem oi : orderItems) {
            try {
                String certNum = isFirstItem ? savedOrder.getCertificateNumber() : null;
                com.wristo.modules.provenance.entity.AuthenticityCertificate cert = certificateService.issueCertificate(
                        savedOrder, oi.getWatch(), user, certNum);
                provenanceService.recordAcquisition(savedOrder, oi.getWatch(), user, cert, oi.getTotalPrice());
                isFirstItem = false;
            } catch (Exception e) {
                log.warn("Could not automatically issue certificate/provenance for item {}: {}", oi.getId(), e.getMessage());
            }
        }

        // 7. Audit Status History
        OrderStatusHistory history = new OrderStatusHistory();
        history.setId("osh_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        history.setOrder(savedOrder);
        history.setFromStatus(null);
        history.setToStatus(initialStatus.name());
        history.setChangedBy(principal != null ? principal.getUsername() : request.address().email());
        history.setComment("Order placed successfully via Luxury Checkout State Machine");
        history.setCreatedAt(Instant.now());
        orderStatusHistoryRepository.save(history);

        // 8. Increment Coupon Usage
        if (coupon != null) {
            couponService.incrementUsage(coupon);
        }

        // 9. Record Payment transaction
        PaymentGatewayType gatewayType = mapPaymentMethodToGateway(paymentMethod);
        paymentService.recordPayment(
                savedOrder,
                gatewayType,
                paymentMethod,
                request.paymentTransactionId(),
                request.gatewayOrderId(),
                request.gatewayPaymentId(),
                request.gatewaySignature(),
                totals.totalAmount(),
                initialPaymentStatus
        );

        // 10. Clear Cart
        try {
            cartService.clearCart(userId, clientSessionId);
        } catch (Exception e) {
            log.warn("Could not clear cart after order placement: {}", e.getMessage());
        }

        // 11. Complete Session
        if (session != null) {
            session.setIsCompleted(true);
            checkoutSessionRepository.save(session);
        }

        // 12. Real-time Telemetry & Push Notification Broadcast
        if (notificationPublisherService != null) {
            try {
                String city = (savedOrder.getShippingCity() != null && !savedOrder.getShippingCity().isBlank())
                        ? savedOrder.getShippingCity() : "India";
                String primaryModel = !orderItems.isEmpty() ? orderItems.get(0).getWatchModel() : "Luxury Timepiece";
                String primaryId = !orderItems.isEmpty() ? orderItems.get(0).getWatch().getId() : "WRT-001";

                notificationPublisherService.broadcastMarketTicker(new com.wristo.modules.notification.dto.LiveActivityEventDto(
                        "ORDER_PLACED",
                        "A collector in " + city + " just acquired " + primaryModel + " (" + primaryId + ")",
                        primaryId,
                        primaryModel,
                        city
                ));

                if (user != null) {
                    notificationPublisherService.sendUserOrderNotification(
                            user.getId().toString(),
                            new com.wristo.modules.notification.dto.OrderNotificationDto(
                                    savedOrder.getOrderNumber(),
                                    savedOrder.getStatus() != null ? savedOrder.getStatus().name() : "CONFIRMED",
                                    "Order Confirmed",
                                    "Your luxury order " + savedOrder.getOrderNumber() + " has been confirmed and reserved in the vault."
                            )
                    );
                }
            } catch (Exception ex) {
                log.warn("Could not publish real-time notification for order {}: {}", savedOrder.getOrderNumber(), ex.getMessage());
            }
        }

        log.info("Completed luxury checkout: Order {} (Cert: {}) created for {}",
                savedOrder.getOrderNumber(), savedOrder.getCertificateNumber(), request.address().email());

        return OrderResponse.from(savedOrder);
    }

    private UUID resolveListingId(String watchId) {
        List<SellerListing> offers = sellerListingRepository.findActiveOffersForWatch(watchId, ListingStatus.ACTIVE);
        if (!offers.isEmpty()) {
            return offers.get(0).getId();
        }
        return null;
    }

    private PaymentGatewayType mapPaymentMethodToGateway(PaymentMethod method) {
        if (method == PaymentMethod.COD) return PaymentGatewayType.COD;
        if (method == PaymentMethod.RAZORPAY) return PaymentGatewayType.RAZORPAY;
        if (method == PaymentMethod.STRIPE) return PaymentGatewayType.STRIPE;
        return PaymentGatewayType.MANUAL_MOCK;
    }
}
