package com.pictofold.backend.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponse {
    
    private Long id;
    private String cloudinaryUrl;
    private String originalFilename;
    private Long fileSize;
    private String format;
    private String processingStatus;
    private Instant uploadedAt;
}
