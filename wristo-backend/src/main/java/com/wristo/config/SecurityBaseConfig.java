package com.wristo.config;

import com.wristo.security.jwt.JwtAuthenticationEntryPoint;
import com.wristo.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityBaseConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityBaseConfig(CorsConfigurationSource corsConfigurationSource,
                              JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                              JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public OpenAPI / Swagger Documentation
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Actuator Health & Metrics
                        .requestMatchers("/actuator/**").permitAll()

                        // Public Catalog & Discovery Endpoints
                        .requestMatchers(
                                "/watches/**",
                                "/brands/**",
                                "/categories/**",
                                "/health/**"
                        ).permitAll()

                        // Auth Endpoints (Phase 2)
                        .requestMatchers("/auth/**").permitAll()

                        // Seller Onboarding
                        .requestMatchers("/seller/onboard").authenticated()

                        // Seller Portal
                        .requestMatchers("/seller/**").hasAnyRole("SELLER", "SELLER_STAFF", "ADMIN")

                        // Admin Portal
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // User & Profile Endpoints
                        .requestMatchers("/user/**").authenticated()

                        // Any other request authenticated
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
