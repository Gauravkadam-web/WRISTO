package com.wristo.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.common.dto.ApiErrorResponse;
import com.wristo.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        log.warn("Responding with 401 unauthorized error for request [{}]: {}", request.getRequestURI(), authException.getMessage());

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ApiErrorResponse errorResponse = ApiErrorResponse.of(
                ErrorCode.UNAUTHORIZED_ACCESS.getCode(),
                "Full authentication is required to access this luxury horological resource."
        );

        response.getOutputStream().println(objectMapper.writeValueAsString(errorResponse));
    }
}
