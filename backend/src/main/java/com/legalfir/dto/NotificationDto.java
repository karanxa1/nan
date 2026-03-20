package com.legalfir.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;
    private Long userId;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
