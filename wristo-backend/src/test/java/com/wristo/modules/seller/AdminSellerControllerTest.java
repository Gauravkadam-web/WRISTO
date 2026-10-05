package com.wristo.modules.seller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.seller.dto.SellerStatusUpdateRequest;
import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerStatus;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerDocumentRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.modules.seller.repository.SellerUserRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminSellerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerUserRepository sellerUserRepository;

    @Autowired
    private SellerDocumentRepository sellerDocumentRepository;

    @Autowired
    private SellerBrandAuthorizationRepository sellerBrandAuthorizationRepository;

    @Autowired
    private SellerListingRepository sellerListingRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private InventoryReservationRepository inventoryReservationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String adminToken;
    private String customerToken;
    private Seller testSeller;

    @BeforeEach
    void setUp() {
        inventoryMovementRepository.deleteAll();
        inventoryReservationRepository.deleteAll();
        inventoryRepository.deleteAll();
        sellerListingRepository.deleteAll();
        sellerBrandAuthorizationRepository.deleteAll();
        sellerDocumentRepository.deleteAll();
        sellerUserRepository.deleteAll();
        sellerRepository.deleteAll();
        userRepository.deleteAll();

        User adminUser = new User("admin@wristo.luxury", passwordEncoder.encode("AdminPass@123"), "Super Admin", null, "ADMIN");
        adminUser = userRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(adminUser));

        User customerUser = new User("collector@wristo.luxury", passwordEncoder.encode("CustPass@123"), "Collector", null, "CUSTOMER");
        customerUser = userRepository.save(customerUser);
        customerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(customerUser));

        testSeller = new Seller("seller-monaco-horology", "Monaco Horology", "Monaco Horology SARL", "27AABCU9603R1ZZ", "AABCU9603R", "MC58000111223344", "HDFC0001234");
        testSeller = sellerRepository.save(testSeller);
    }

    @Test
    void shouldListSellersForAdmin() throws Exception {
        mockMvc.perform(get("/admin/sellers")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items").isArray())
                .andExpect(jsonPath("$.data.items[0].id").value("seller-monaco-horology"));
    }

    @Test
    void shouldApproveSellerStatus() throws Exception {
        SellerStatusUpdateRequest request = new SellerStatusUpdateRequest(SellerStatus.VERIFIED, null, new BigDecimal("10.00"));

        mockMvc.perform(patch("/admin/sellers/" + testSeller.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("VERIFIED"))
                .andExpect(jsonPath("$.data.commissionRate").value(10.00));
    }

    @Test
    void shouldRejectCustomerAccessToAdminEndpoints() throws Exception {
        mockMvc.perform(get("/admin/sellers")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
