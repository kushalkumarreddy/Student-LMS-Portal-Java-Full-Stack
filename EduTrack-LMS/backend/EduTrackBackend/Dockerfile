# ===================================================
# Stage 1: Build stage with Maven and Java 21
# ===================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and pre-fetch dependencies for efficient Docker layer caching
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy project source code
COPY src ./src

# Build production executable fat JAR
RUN mvn clean package -DskipTests

# ===================================================
# Stage 2: Production Runtime with Eclipse Temurin JRE 21
# ===================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: Run as dedicated non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy executable jar from builder stage
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Default port (Render overrides this with dynamic PORT environment variable)
ENV PORT=8080
EXPOSE ${PORT}

# Launch Spring Boot with dynamic port binding
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
