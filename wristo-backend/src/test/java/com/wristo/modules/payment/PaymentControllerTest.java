package com.wristo.modules.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.payment.dto.CreatePaymentOrderRequest;
import com.wristo.modules.payment.dto.VerifyPaymentRequest;
import com.wristo.modules.payment.entity.PaymentGatewayType;
import com.wristo.modules.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
    }

    @Test
    void shouldCreatePaymentOrderIntent() throws Exception {
        CreatePaymentOrderRequest req = new CreatePaymentOrderRequest(
                "chk_sess_test_123",
                "ord_test_456",
                BigDecimal.valueOf(15000.00),
                "INR",
                PaymentGatewayType.RAZORPAY,
                PaymentMethod.CARD,
                "buyer@wristo.luxury",
                "+919876543210"
        );

        mockMvc.perform(post("/payments/create-intent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.gatewayOrderId").isNotEmpty())
                .andExpect(jsonPath("$.data.amount").value(15000.00))
                .andExpect(jsonPath("$.data.gateway").value("RAZORPAY"));
    }

    @Test
    void shouldVerifyPaymentSignature() throws Exception {
        VerifyPaymentRequest req = new VerifyPaymentRequest(
                PaymentGatewayType.RAZORPAY,
                null,
                "order_rzp_test_123",
                "pay_test_456",
                "sig_test_789",
                "captured"
        );

        mockMvc.perform(post("/payments/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PAID"));
    }

    @Test
    void shouldHandlePaymentWebhook() throws Exception {
        Map<String, Object> payload = Map.of(
                "event", "payment.captured",
                "account_id", "acc_test_123"
        );

        mockMvc.perform(post("/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
