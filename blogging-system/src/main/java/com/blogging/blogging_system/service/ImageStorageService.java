package com.blogging.blogging_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final Path uploadDirectory = Paths.get("uploads");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder", e);
        }
    }

    public String storeImage(MultipartFile image) throws IOException {

        if (image == null || image.isEmpty()) {
            return null;
        }

        String contentType = image.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        String originalFileName = image.getOriginalFilename();

        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(
                    originalFileName.lastIndexOf(".")
            );
        }

        String fileName = UUID.randomUUID() + extension;

        Path filePath = uploadDirectory.resolve(fileName);

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/" + fileName;
    }

    public void deleteImage(String imageUrl) throws IOException {

    if (imageUrl == null || imageUrl.isEmpty()) {
        return;
    }

    String fileName = imageUrl.substring(
            imageUrl.lastIndexOf("/") + 1
    );

    Path filePath = uploadDirectory.resolve(fileName);

    Files.deleteIfExists(filePath);
}
}