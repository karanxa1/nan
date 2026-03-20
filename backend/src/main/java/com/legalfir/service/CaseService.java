package com.legalfir.service;

import com.legalfir.dto.CaseDto;
import com.legalfir.dto.CaseRequest;
import com.legalfir.dto.CaseLogDto;
import com.legalfir.entity.Case;
import com.legalfir.entity.User;
import java.util.List;

public interface CaseService {
    CaseDto create(CaseRequest request);
    List<CaseDto> getAll();
    List<CaseDto> getMyCases(User user);
    CaseDto getById(Long id);
    CaseDto update(Long id, CaseRequest request, User admin);
    CaseLogDto addLog(Long caseId, String note);
}
