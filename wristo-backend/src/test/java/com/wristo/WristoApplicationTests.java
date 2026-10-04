package com.wristo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class WristoApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext starts and beans wire correctly
    }
}
