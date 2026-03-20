package com.legalfir.service.impl;

import com.legalfir.dto.CaseDto;
import com.legalfir.dto.CaseLogDto;
import com.legalfir.dto.CaseRequest;
import com.legalfir.entity.Case;
import com.legalfir.entity.CaseLog;
import com.legalfir.entity.FIR;
import com.legalfir.entity.User;
import com.legalfir.repository.CaseLogRepository;
import com.legalfir.repository.CaseRepository;
import com.legalfir.repository.FIRRepository;
import com.legalfir.service.CaseService;
import com.legalfir.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseServiceImpl implements CaseService {

    private final CaseRepository caseRepository;
    private final FIRRepository firRepository;
    private final CaseLogRepository caseLogRepository;
    private final NotificationService notificationService;

    @Override
    public CaseDto create(CaseRequest request) {
        FIR fir = firRepository.findById(request.getFirId())
                .orElseThrow(() -> new RuntimeException("FIR not found"));
        Case c = Case.builder()
                .fir(fir)
                .title(request.getTitle())
                .assignedTo(request.getAssignedTo())
                .status(Case.Status.OPEN)
                .build();
        Case saved = caseRepository.save(c);
        notificationService.send(fir.getUser(), "A case has been opened for your FIR #" + fir.getId());
        return toDto(saved);
    }

    @Override
    public List<CaseDto> getAll() {
        return caseRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<CaseDto> getMyCases(User user) {
        return caseRepository.findByUserId(user.getId()).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CaseDto getById(Long id) {
        Case c = caseRepository.findById(id).orElseThrow(() -> new RuntimeException("Case not found"));
        CaseDto dto = toDto(c);
        dto.setLogs(caseLogRepository.findByCaseEntityIdOrderByCreatedAtAsc(id)
                .stream().map(this::toLogDto).collect(Collectors.toList()));
        return dto;
    }

    @Override
    public CaseDto update(Long id, CaseRequest request, User admin) {
        Case c = caseRepository.findById(id).orElseThrow(() -> new RuntimeException("Case not found"));
        Case.Status oldStatus = c.getStatus();
        if (request.getTitle() != null) c.setTitle(request.getTitle());
        if (request.getAssignedTo() != null) c.setAssignedTo(request.getAssignedTo());
        if (request.getStatus() != null) c.setStatus(request.getStatus());
        c.setUpdatedAt(LocalDateTime.now());
        Case saved = caseRepository.save(c);
        if (request.getStatus() != null && request.getStatus() != oldStatus) {
            notificationService.send(c.getFir().getUser(),
                    "Case #" + id + " status changed to: " + request.getStatus().name());
        }
        return toDto(saved);
    }

    @Override
    public CaseLogDto addLog(Long caseId, String note) {
        Case c = caseRepository.findById(caseId).orElseThrow(() -> new RuntimeException("Case not found"));
        CaseLog log = CaseLog.builder().caseEntity(c).note(note).build();
        return toLogDto(caseLogRepository.save(log));
    }

    private CaseDto toDto(Case c) {
        CaseDto dto = new CaseDto();
        dto.setId(c.getId());
        dto.setFirId(c.getFir().getId());
        dto.setFirTitle(c.getFir().getTitle());
        dto.setUserId(c.getFir().getUser().getId());
        dto.setUserName(c.getFir().getUser().getName());
        dto.setTitle(c.getTitle());
        dto.setStatus(c.getStatus());
        dto.setAssignedTo(c.getAssignedTo());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    private CaseLogDto toLogDto(CaseLog log) {
        CaseLogDto dto = new CaseLogDto();
        dto.setId(log.getId());
        dto.setCaseId(log.getCaseEntity().getId());
        dto.setNote(log.getNote());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }
}
