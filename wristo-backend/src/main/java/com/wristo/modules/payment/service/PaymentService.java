package com.wristo.modules.payment.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.payment.dto.CreatePaymentOrderRequest;
import com.wristo.modules.payment.dto.PaymentOrderResponse;
import com.wristo.modules.payment.dto.PaymentResponse;
import com.wristo.modules.payment.dto.VerifyPaymentRequest;
import com.wristo.modules.payment.entity.Payment;
import com.wristo.modules.payment.entity.PaymentGatewayType;
import com.wristo.modules.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${wristo.payment.razorpay.key-id:rzp_test_mock_key}")
    private String razorpayKeyId;

    @Value("${wristo.payment.razorpay.key-secret:rzp_test_mock_secret}")
    private String razorpayKeySecret;

    @Value("${wristo.payment.stripe.publishable-key:pk_test_mock_key}")
    private String stripePublishableKey;

    @Value("${wristo.payment.stripe.secret-key:sk_test_mock_secret}")
    private String stripeSecretKey;

    @Value("${wristo.payment.sandbox-enabled:true}")
    private boolean sandboxEnabled;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public PaymentOrderResponse createPaymentOrder(CreatePaymentOrderRequest request) {
        PaymentGatewayType gateway = request.gateway();
        String currency = request.currency() != null ? request.currency() : "INR";
        BigDecimal amount = request.amount();

        String gatewayOrderId = "pay_ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String keyId = razorpayKeyId;
        String clientSecret = null;

        if (gateway == PaymentGatewayType.STRIPE) {
            keyId = stripePublishableKey;
            clientSecret = "pi_mock_" + UUID.randomUUID().toString().replace("-", "") + "_secret_mock";
        } else if (gateway == PaymentGatewayType.RAZORPAY) {
            gatewayOrderId = "order_rzp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            keyId = razorpayKeyId;

            // When active Razorpay API keys are configured, request authentic Order ID from Razorpay
            if (razorpayKeyId != null && !razorpayKeyId.isBlank() && !razorpayKeyId.contains("mock") &&
                razorpayKeySecret != null && !razorpayKeySecret.isBlank() && !razorpayKeySecret.contains("mock")) {
                try {
                    long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();
                    String auth = Base64.getEncoder().encodeToString(
                            (razorpayKeyId.trim() + ":" + razorpayKeySecret.trim()).getBytes(StandardCharsets.UTF_8)
                    );
                    String receipt = "rcpt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
                    String orderIdNote = request.orderId() != null ? request.orderId() : "";

                    String jsonBody = String.format(
                            "{\"amount\":%d,\"currency\":\"%s\",\"receipt\":\"%s\",\"notes\":{\"orderId\":\"%s\"}}",
                            amountInPaise, currency, receipt, orderIdNote
                    );

                    HttpClient client = HttpClient.newBuilder()
                            .connectTimeout(Duration.ofSeconds(5))
                            .build();

                    HttpRequest httpRequest = HttpRequest.newBuilder()
                            .uri(URI.create("https://api.razorpay.com/v1/orders"))
                            .header("Authorization", "Basic " + auth)
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                            .timeout(Duration.ofSeconds(8))
                            .build();

                    HttpResponse<String> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
                    if (httpResponse.statusCode() == 200 || httpResponse.statusCode() == 201) {
                        JsonNode node = objectMapper.readTree(httpResponse.body());
                        if (node.has("id")) {
                            gatewayOrderId = node.get("id").asText();
                            log.info("Live Razorpay Order generated: {} for amount: {} {}", gatewayOrderId, amount, currency);
                        }
                    } else {
                        log.warn("Razorpay API order response status ({}): {}. Utilizing standard gateway order sequence.",
                                httpResponse.statusCode(), httpResponse.body());
                    }
                } catch (Exception e) {
                    log.warn("Could not communicate with live Razorpay Order endpoint ({}). Falling back to resilient sandbox order.", e.getMessage());
                }
            }
        } else if (gateway == PaymentGatewayType.COD) {
            gatewayOrderId = "cod_" + UUID.randomUUID().toString().substring(0, 8);
            keyId = null;
        }

        log.info("Created payment intent/order with gateway: {}, gatewayOrderId: {}, amount: {}",
                gateway, gatewayOrderId, amount);

        return new PaymentOrderResponse(
                gatewayOrderId,
                gateway,
                amount,
                currency,
                keyId,
                request.orderId(),
                clientSecret,
                "CREATED"
        );
    }

    @Transactional
    public PaymentResponse verifyPayment(VerifyPaymentRequest request) {
        PaymentGatewayType gateway = request.gateway();

        boolean isValid = verifySignature(
                gateway,
                request.gatewayOrderId(),
                request.gatewayPaymentId(),
                request.gatewaySignature()
        );

        if (!isValid && !sandboxEnabled) {
            throw new BusinessException(ErrorCode.PAYMENT_SIGNATURE_INVALID, "Payment signature verification failed");
        }

        Payment payment = new Payment();
        payment.setId("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        payment.setPaymentGateway(gateway);
        payment.setGatewayOrderId(request.gatewayOrderId());
        payment.setGatewayPaymentId(request.gatewayPaymentId());
        payment.setGatewaySignature(request.gatewaySignature());
        payment.setTransactionId(request.gatewayPaymentId() != null ? request.gatewayPaymentId() : "txn_" + UUID.randomUUID().toString().substring(0, 12));
        payment.setAmount(BigDecimal.ZERO);
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentMethod(PaymentMethod.CARD);

        if (request.orderId() != null && !request.orderId().isBlank()) {
            Optional<Order> orderOpt = orderRepository.findById(request.orderId())
                    .or(() -> orderRepository.findByOrderNumber(request.orderId()));
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                payment.setOrder(order);
                payment.setAmount(order.getTotalAmount());
                payment.setCurrency(order.getCurrency());
                payment.setPaymentMethod(order.getPaymentMethod());

                order.setPaymentStatus(PaymentStatus.PAID);
                orderRepository.save(order);
            }
        }

        Payment saved = paymentRepository.save(payment);
        log.info("Verified and persisted payment record: {} for order: {}", saved.getId(), request.orderId());

        return PaymentResponse.from(saved);
    }

    public boolean verifySignature(
            PaymentGatewayType gateway,
            String gatewayOrderId,
            String gatewayPaymentId,
            String gatewaySignature
    ) {
        if (sandboxEnabled) {
            // In sandbox mode or mock test scenarios, allow test verification
            return true;
        }

        if (gateway == PaymentGatewayType.RAZORPAY) {
            if (gatewayOrderId == null || gatewayPaymentId == null || gatewaySignature == null) {
                return false;
            }
            try {
                String payload = gatewayOrderId + "|" + gatewayPaymentId;
                Mac mac = Mac.getInstance("HmacSHA256");
                SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
                mac.init(secretKey);
                byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
                String expectedSignature = HexFormat.of().formatHex(hash);
                return MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), gatewaySignature.getBytes(StandardCharsets.UTF_8));
            } catch (Exception e) {
                log.error("Error computing Razorpay signature verification: {}", e.getMessage());
                return false;
            }
        }

        return true;
    }

    @Transactional
    public Payment recordPayment(
            Order order,
            PaymentGatewayType gateway,
            PaymentMethod method,
            String transactionId,
            String gatewayOrderId,
            String gatewayPaymentId,
            String gatewaySignature,
            BigDecimal amount,
            PaymentStatus status
    ) {
        Payment payment = new Payment();
        payment.setId("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        payment.setOrder(order);
        payment.setPaymentGateway(gateway);
        payment.setPaymentMethod(method);
        payment.setTransactionId(transactionId != null && !transactionId.isBlank()
                ? transactionId
                : "txn_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14));
        payment.setGatewayOrderId(gatewayOrderId);
        payment.setGatewayPaymentId(gatewayPaymentId);
        payment.setGatewaySignature(gatewaySignature);
        payment.setAmount(amount);
        payment.setCurrency(order.getCurrency());
        payment.setStatus(status);

        Payment saved = paymentRepository.save(payment);
        log.info("Recorded payment transaction {} for order {}", saved.getId(), order.getOrderNumber());
        return saved;
    }
}
