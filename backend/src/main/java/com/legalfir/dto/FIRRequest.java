package com.legalfir.dto;

import com.legalfir.entity.FIR;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FIRRequest {
    private String title;
    private String description;
    private String location;
    private LocalDate incidentDate;
}
