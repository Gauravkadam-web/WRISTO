# ==============================================================================
# WRISTO Backend — Production Multi-Stage Dockerfile (Spring Boot 3.3.4 + Java 21)
# ==============================================================================

# Stage 1: Build & Package
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source and build JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production Runtime
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Create dedicated non-root user
RUN addgroup -S wristo && adduser -S wristo -G wristo

# Copy packaged jar from builder
COPY --from=builder /build/target/wristo-backend-*.jar app.jar

# Set ownership
RUN chown -R wristo:wristo /app

USER wristo

# Standard Spring Boot Port
EXPOSE 8080

# Production Container JVM Optimizations
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
