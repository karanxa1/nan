package com.legalfir.service;

import com.legalfir.dto.FIRDto;
import com.legalfir.dto.FIRRequest;
import com.legalfir.entity.FIR;
import com.legalfir.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface FIRService {
    FIRDto create(FIRRequest request, User user);
    List<FIRDto> getMyFIRs(User user);
    List<FIRDto> getAllFIRsFlat();
    FIRDto getById(Long id);
    FIRDto updateStatus(Long id, FIR.Status status);
    void delete(Long id);
    FIRDto toDto(FIR fir);
}

