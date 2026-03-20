package com.legalfir.dto;

import com.legalfir.entity.Case;
import lombok.Data;

@Data
public class CaseRequest {
    private Long firId;
    private String title;
    private String assignedTo;
    private Case.Status status;
}
