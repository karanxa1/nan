package com.legalfir.dto;

import com.legalfir.entity.Case;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CaseDto {
    private Long id;
    private Long firId;
    private String firTitle;
    private Long userId;
    private String userName;
    private String title;
    private Case.Status status;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CaseLogDto> logs;
}
