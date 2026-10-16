package com.tour.travel.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/tinymce")
public class TinyMCEImageUploadController {

    private static final String IMAGE_FOLDER = "uploads/tinymce/";

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No file uploaded"));
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "File size exceeds 10MB limit"));
            }
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid filename"));
            }
            String sanitized = sanitizeFilename(originalFilename);
            if (!isValidFilename(sanitized)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid file name"));
            }
            String extension = getFileExtension(sanitized);
            if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid file extension. Allowed: jpg, jpeg, png, gif, webp"));
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "File must be an image"));
            }
            String uniqueFilename = generateUniqueFilename(sanitized);
            Path uploadPath = Paths.get(IMAGE_FOLDER);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            String protocol = request.isSecure() ? "https://" : "http://";
            String serverName = request.getServerName();
            int serverPort = request.getServerPort();
            String portString = (serverPort == 80 || serverPort == 443) ? "" : ":" + serverPort;
            String imageUrl = protocol + serverName + portString + "/api/tinymce/images/" + uniqueFilename;
            Map<String, String> response = new HashMap<>();
            response.put("location", imageUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName) {
        try {
            java.nio.file.Path imagePath = Paths.get(IMAGE_FOLDER + imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String sanitizeFilename(String filename) {
        filename = filename.replaceAll("\\.\\.", "");
        filename = filename.replaceAll("[^a-zA-Z0-9.\\-_]", "_");
        return filename;
    }

    private boolean isValidFilename(String filename) {
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return false;
        }
        if (filename.matches(".*\\.{2,}.*")) {
            return false;
        }
        return !filename.isEmpty();
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1) {
            return "";
        }
        return filename.substring(lastDot + 1);
    }

    private String generateUniqueFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String nameWithoutExt = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
        nameWithoutExt = nameWithoutExt.replaceAll("[^a-zA-Z0-9\\-_]", "_");
        String timestamp = String.valueOf(System.currentTimeMillis());
        String shortUUID = UUID.randomUUID().toString().substring(0, 8);
        return nameWithoutExt + "_" + timestamp + "_" + shortUUID + "." + extension;
    }
}
