package com.wristo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI wristoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("WRISTO — Ultra-Luxury Watch Marketplace REST API")
                        .description("Production REST API engine for WRISTO luxury watch marketplace, catalog, cart, checkout, provenance ledger, and AI concierge.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Gaurav Kadam (WRISTO Architecture Lead)")
                                .email("gauravkadam@gmail.com")
                                .url("https://github.com/Gauravkadam-web/WRISTO"))
                        .license(new License()
                                .name("Proprietary / All Rights Reserved")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter your JWT token in the format: Bearer <token>")));
    }
}
