package com.wristo.modules.seller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.repository.BrandRepository;
import com.wristo.modules.seller.dto.BrandAuthorizationRequest;
import com.wristo.modules.seller.dto.DocumentUploadRequest;
import com.wristo.modules.seller.dto.SellerOnboardRequest;
import com.wristo.modules.seller.dto.SellerStaffRequest;
import com.wristo.modules.seller.entity.SellerStaffRole;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerDocumentRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SellerControllerTest {

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
    private BrandRepository brandRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User sellerUser;
    private String sellerToken;

    @BeforeEach
    void setUp() {
        sellerBrandAuthorizationRepository.deleteAll();
        sellerDocumentRepository.deleteAll();
        sellerUserRepository.deleteAll();
        sellerRepository.deleteAll();
        userRepository.deleteAll();

        sellerUser = new User("seller.owner@genevawatches.ch", passwordEncoder.encode("SecretPass@123"), "Pierre Jaquet", "+4122334455", "CUSTOMER");
        sellerUser = userRepository.save(sellerUser);

        UserPrincipal principal = UserPrincipal.create(sellerUser);
        sellerToken = jwtTokenProvider.generateAccessToken(principal);
    }

    @Test
    void shouldSubmitSellerOnboardingSuccessfully() throws Exception {
        SellerOnboardRequest request = new SellerOnboardRequest();
        request.setBusinessName("Geneva Timepieces");
        request.setLegalEntityName("Geneva Timepieces SA");
        request.setGstin("27AABCU9603R1ZM");
        request.setPan("AABCU9603R");
        request.setBankAccountNumber("CH9300762011623852957");
        request.setIfscCode("HDFC0001234");

        mockMvc.perform(post("/seller/onboard")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.businessName").value("Geneva Timepieces"))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(jsonPath("$.data.staff[0].role").value("OWNER"));
    }

    @Test
    void shouldRejectUnauthenticatedSellerAccess() throws Exception {
        mockMvc.perform(get("/seller/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAddStaffAndUploadDocsForOnboardedSeller() throws Exception {
        // 1. Onboard seller
        SellerOnboardRequest request = new SellerOnboardRequest();
        request.setBusinessName("Zurich Chrono");
        request.setLegalEntityName("Zurich Chrono AG");
        request.setGstin("27AABCU9603R1ZN");
        request.setPan("AABCU9603R");
        request.setBankAccountNumber("CH9300762011623852999");
        request.setIfscCode("SBIN0004567");

        mockMvc.perform(post("/seller/onboard")
                        .header("Authorization", "Bearer " + sellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Refresh token with SELLER role
        User updatedSeller = userRepository.findById(sellerUser.getId()).orElseThrow();
        String activeSellerToken = jwtTokenProvider.generateAccessToken(UserPrincipal.create(updatedSeller));

        // 2. Upload KYC Doc
        DocumentUploadRequest docReq = new DocumentUploadRequest("GST_CERTIFICATE", "https://cdn.wristo.luxury/docs/gst-zurich.pdf");
        mockMvc.perform(post("/seller/documents")
                        .header("Authorization", "Bearer " + activeSellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(docReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.documentType").value("GST_CERTIFICATE"));

        // 3. Create staff user & add to seller
        User staffUser = new User("staff1@zurichchrono.ch", passwordEncoder.encode("Pass@123"), "Staff Member", null, "CUSTOMER");
        userRepository.save(staffUser);

        SellerStaffRequest staffReq = new SellerStaffRequest("staff1@zurichchrono.ch", SellerStaffRole.INVENTORY_MANAGER, false);
        mockMvc.perform(post("/seller/staff")
                        .header("Authorization", "Bearer " + activeSellerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(staffReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.role").value("INVENTORY_MANAGER"));
    }
}
