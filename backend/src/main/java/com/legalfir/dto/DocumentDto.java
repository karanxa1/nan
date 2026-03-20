package com.legalfir.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentDto {
    private Long id;
    private Long caseId;
    private Long userId;
    private String userName;
    private String fileName;
    private LocalDateTime uploadedAt;
}
