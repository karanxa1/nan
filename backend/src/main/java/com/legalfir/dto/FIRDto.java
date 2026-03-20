package com.legalfir.dto;

import com.legalfir.entity.FIR;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class FIRDto {
    private Long id;
    private Long userId;
    private String userName;
    private String title;
    private String description;
    private String location;
    private LocalDate incidentDate;
    private FIR.Status status;
    private LocalDateTime createdAt;
}
