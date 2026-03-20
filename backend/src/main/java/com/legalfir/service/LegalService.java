package com.legalfir.service;

import com.legalfir.dto.LegalSectionDto;
import com.legalfir.entity.LegalSection;
import java.util.List;
import java.util.Map;

public interface LegalService {
    List<LegalSectionDto> getAll(int page, int size);
    List<LegalSectionDto> search(String q);
    LegalSectionDto getById(Long id);
    Map<String, Object> checkBail(Long id);
    LegalSectionDto create(LegalSectionDto dto);
    LegalSectionDto update(Long id, LegalSectionDto dto);
    void delete(Long id);
}
