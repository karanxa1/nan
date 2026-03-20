package com.legalfir.dto;

import com.legalfir.entity.LegalSection;
import lombok.Data;

@Data
public class LegalSectionDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private LegalSection.ActType actType;
    private boolean isBailable;
}
