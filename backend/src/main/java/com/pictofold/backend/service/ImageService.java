package com.pictofold.backend.service;

import com.pictofold.backend.dto.ImageResponse;
import com.pictofold.backend.model.Image;
import com.pictofold.backend.model.User;
import com.pictofold.backend.repository.ImageRepository;
import com.pictofold.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public ImageResponse uploadImage(MultipartFile file, String userEmail) throws IOException {
        // Find user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Upload to Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.uploadImage(file, user.getId());

        // Create image entity
        Image image = Image.builder()
                .user(user)
                .cloudinaryUrl(uploadResult.get("url").toString())
                .publicId(uploadResult.get("publicId").toString())
                .originalFilename(file.getOriginalFilename())
                .fileSize(((Number) uploadResult.get("bytes")).longValue())
                .format(uploadResult.get("format").toString())
                .processingStatus("PENDING")
                .build();

        // Save to database
        image = imageRepository.save(image);

        // Return response
        return mapToResponse(image);
    }

    public List<ImageResponse> getUserImages(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return imageRepository.findByUserIdOrderByUploadedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteImage(Long imageId, String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Verify ownership
        if (!image.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this image");
        }

        // Delete from Cloudinary
        cloudinaryService.deleteImage(image.getPublicId());

        // Delete from database
        imageRepository.delete(image);
    }

    private ImageResponse mapToResponse(Image image) {
        return ImageResponse.builder()
                .id(image.getId())
                .cloudinaryUrl(image.getCloudinaryUrl())
                .originalFilename(image.getOriginalFilename())
                .fileSize(image.getFileSize())
                .format(image.getFormat())
                .processingStatus(image.getProcessingStatus())
                .uploadedAt(image.getUploadedAt())
                .build();
    }
}
