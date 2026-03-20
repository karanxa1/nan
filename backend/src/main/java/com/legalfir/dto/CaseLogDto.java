package com.legalfir.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CaseLogDto {
    private Long id;
    private Long caseId;
    private String note;
    private LocalDateTime createdAt;
}
