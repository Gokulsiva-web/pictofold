package com.pictofold.backend.model;

import java.time.Instant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String cloudinaryUrl;

    @Column(nullable = false, length = 200)
    private String publicId;

    @Column(length = 255)
    private String originalFilename;

    @Column(nullable = false)
    private Long fileSize; // in bytes

    @Column(length = 10)
    private String format; // jpeg, png

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String processingStatus = "PENDING"; // PENDING, PROCESSING, COMPLETED, FAILED

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant uploadedAt;

    @Column(length = 500)
    private String processedImageUrl; // URL of the AI-processed image (for future use)
}
