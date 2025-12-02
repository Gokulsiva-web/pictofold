package com.pictofold.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Map<String, Object> uploadImage(MultipartFile file, Long userId) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Only JPEG and PNG images are allowed");
        }

        // Validate file size (10MB max)
        long maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        // Upload to user-specific folder with options
        Map<String, Object> uploadOptions = ObjectUtils.asMap(
            "folder", "pictofold/user_" + userId,
            "resource_type", "image",
            "allowed_formats", new String[]{"jpg", "jpeg", "png"}
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
        
        // Validate response has required fields
        if (uploadResult.get("secure_url") == null || uploadResult.get("public_id") == null) {
            throw new IOException("Invalid response from Cloudinary: missing required fields");
        }
        
        // Return comprehensive result
        return Map.of(
            "url", uploadResult.get("secure_url").toString(),
            "publicId", uploadResult.get("public_id").toString(),
            "format", uploadResult.get("format") != null ? uploadResult.get("format").toString() : "unknown",
            "bytes", uploadResult.get("bytes") != null ? uploadResult.get("bytes") : 0
        );
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
