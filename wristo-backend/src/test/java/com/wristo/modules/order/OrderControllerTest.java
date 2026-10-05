package com.wristo.modules.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.catalog.repository.CategoryRepository;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.checkout.repository.CheckoutSessionRepository;
import com.wristo.modules.inventory.entity.Inventory;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.order.dto.CancelOrderRequest;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderItem;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderItemRepository;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.modules.payment.repository.PaymentRepository;
import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerListing;
import com.wristo.modules.seller.entity.SellerStatus;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.security.jwt.JwtTokenProvider;
import com.wristo.security.model.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CheckoutSessionRepository checkoutSessionRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private SellerBrandAuthorizationRepository brandAuthorizationRepository;

    @Autowired
    private com.wristo.modules.seller.repository.SellerUserRepository sellerUserRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User customerUser;
    private String customerToken;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
        orderStatusHistoryRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        checkoutSessionRepository.deleteAll();
        inventoryMovementRepository.deleteAll();
        inventoryReservationRepository.deleteAll();
        inventoryRepository.deleteAll();
        sellerUserRepository.deleteAll();
        sellerListingRepository.deleteAll();
        brandAuthorizationRepository.deleteAll();
        sellerRepository.deleteAll();
        watchRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        customerUser = new User("order.collector@wristo.luxury", passwordEncoder.encode("Pass@123"), "Lord Sterling", "+919876543210", "CUSTOMER");
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(customerUser));

        Brand auren = new Brand("brand-auren", "AUREN", "Switzerland", 1928, "Precision Horology", "Swiss calibers", "/assets/brands/auren.png", true);
        auren = brandRepository.save(auren);

        Category men = new Category("cat-men", "men", "Men's Watches", "Men", "Masculine luxury", "male", 1, true);
        men = categoryRepository.save(men);

        Watch watch1 = new Watch();
        watch1.setId("WRT-001");
        watch1.setNum("01");
        watch1.setBrand(auren);
        watch1.setBrandName("AUREN");
        watch1.setModel("Atlas Black");
        watch1.setPrice(BigDecimal.valueOf(10000.00));
        watch1.setOriginalPrice(BigDecimal.valueOf(12000.00));
        watch1.setImageUrl("/assets/products/watch-01.png");
        watch1.setCategory(men);
        watch1.setCategoryName("Men");
        watch1.setGender("Men");
        watch1.setMovement("Automatic");
        watch1.setStyle("Minimal");
        watch1.setCaseSize("40mm");
        watch1.setStrap("Leather");
        watch1.setDial("Black");
        watch1.setMaterial("Steel");
        watch1.setWaterResistance("50m");
        watch1.setTagline("Atlas Minimal");
        watch1.setDescription("Obsidian Black");
        watch1.setStockCount(10);
        watch1.setIsActive(true);
        watch1 = watchRepository.save(watch1);

        Seller seller = new Seller("seller-boutique", "AUREN Boutique London", "Auren UK Ltd", "GB123456789", "AURENUK", "1234567890", "BARC0001234");
        seller.setStatus(SellerStatus.VERIFIED);
        seller.setIsActive(true);
        seller = sellerRepository.save(seller);

        SellerListing listing1 = new SellerListing();
        listing1.setSeller(seller);
        listing1.setWatch(watch1);
        listing1.setSellerSku("SKU-AUR-LONDON-01");
        listing1.setPrice(BigDecimal.valueOf(10000.00));
        listing1.setOriginalPrice(BigDecimal.valueOf(12000.00));
        listing1.setStatus(ListingStatus.ACTIVE);
        listing1.setIsActive(true);
        listing1 = sellerListingRepository.save(listing1);

        Inventory inventory = new Inventory();
        inventory.setSellerListing(listing1);
        inventory.setAvailableQuantity(9);
        inventory.setReservedQuantity(0);
        inventory.setSoldQuantity(1);
        inventory.setTotalQuantity(10);
        inventoryRepository.save(inventory);

        testOrder = new Order();
        testOrder.setId("ord_test_001");
        testOrder.setOrderNumber("WRT-2026-10001");
        testOrder.setCertificateNumber("CERT-CHRONO-100001");
        testOrder.setUser(customerUser);
        testOrder.setCustomerName("Lord Sterling");
        testOrder.setCustomerEmail("order.collector@wristo.luxury");
        testOrder.setCustomerPhone("+919876543210");
        testOrder.setShippingAddressLine1("10 Mayfair Tower");
        testOrder.setShippingCity("Mumbai");
        testOrder.setShippingState("Maharashtra");
        testOrder.setShippingPincode("400001");
        testOrder.setShippingCountry("India");
        testOrder.setDeliveryTier("insured_express");
        testOrder.setIsGiftWrapped(false);
        testOrder.setSubtotalAmount(BigDecimal.valueOf(10000.00));
        testOrder.setDiscountAmount(BigDecimal.ZERO);
        testOrder.setGiftWrapFee(BigDecimal.ZERO);
        testOrder.setShippingFee(BigDecimal.ZERO);
        testOrder.setTaxAmount(BigDecimal.valueOf(1800.00));
        testOrder.setTotalAmount(BigDecimal.valueOf(11800.00));
        testOrder.setCurrency("INR");
        testOrder.setStatus(OrderStatus.CONFIRMED);
        testOrder.setPaymentStatus(PaymentStatus.PAID);
        testOrder.setPaymentMethod(PaymentMethod.CARD);
        testOrder.setPlacedAt(Instant.now());
        testOrder = orderRepository.save(testOrder);

        OrderItem item = new OrderItem();
        item.setId("item_test_001");
        item.setOrder(testOrder);
        item.setWatch(watch1);
        item.setSeller(seller);
        item.setSellerListing(listing1);
        item.setWatchModel(watch1.getModel());
        item.setWatchBrand(watch1.getBrandName());
        item.setWatchImageUrl(watch1.getImageUrl());
        item.setQuantity(1);
        item.setUnitPrice(BigDecimal.valueOf(10000.00));
        item.setTotalPrice(BigDecimal.valueOf(10000.00));
        item = orderItemRepository.save(item);
        testOrder.getItems().add(item);
    }

    @Test
    void shouldFetchMyOrdersForAuthenticatedCollector() throws Exception {
        mockMvc.perform(get("/orders/my-orders")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.items[0].orderNumber").value("WRT-2026-10001"))
                .andExpect(jsonPath("$.data.items[0].totalAmount").value(11800.00));
    }

    @Test
    void shouldFetchOrderDetailsByOrderNumber() throws Exception {
        mockMvc.perform(get("/orders/WRT-2026-10001")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("WRT-2026-10001"))
                .andExpect(jsonPath("$.data.certificateNumber").value("CERT-CHRONO-100001"))
                .andExpect(jsonPath("$.data.items.length()").value(1));
    }

    @Test
    void shouldCancelOrderAndRestockInventory() throws Exception {
        CancelOrderRequest cancelReq = new CancelOrderRequest("Acquired another vintage piece instead");

        mockMvc.perform(post("/orders/WRT-2026-10001/cancel")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cancelReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }
}
