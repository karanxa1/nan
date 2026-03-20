package com.legalfir.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportSummaryDto {
    private long totalFIRs;
    private long totalCases;
    private long totalUsers;
}
