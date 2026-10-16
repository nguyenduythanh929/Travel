# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /src

# Cache dependencies separately from source
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /src/target/*.jar app.jar

# Uploaded images are stored relative to the working dir (/app/uploads)
RUN mkdir -p /app/uploads/tinymce

EXPOSE 8088
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
