package com.wristo.modules.notification;

import com.wristo.modules.notification.dto.LiveActivityEventDto;
import com.wristo.modules.notification.service.NotificationPublisherService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NotificationPublisherService publisherService;

    @Test
    @DisplayName("GET /notifications/ticker returns live boutique activity ticker events")
    void testGetRecentTickerEvents_returnsInitialBoutiqueFeed() throws Exception {
        mockMvc.perform(get("/notifications/ticker")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(4))))
                .andExpect(jsonPath("$.data[0].type", notNullValue()))
                .andExpect(jsonPath("$.data[0].message", notNullValue()));
    }

    @Test
    @DisplayName("NotificationPublisherService broadcast adds event to ticker history")
    void testBroadcastMarketTicker_addsEventToFeed() throws Exception {
        LiveActivityEventDto customEvent = new LiveActivityEventDto(
                "RARE_ALLOCATION",
                "A VIP Collector in Hyderabad reserved AUREN Grand Master Complication",
                "WRT-004",
                "Grand Master Complication",
                "Hyderabad"
        );

        publisherService.broadcastMarketTicker(customEvent);

        mockMvc.perform(get("/notifications/ticker")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].message", containsString("Hyderabad")));
    }
}
