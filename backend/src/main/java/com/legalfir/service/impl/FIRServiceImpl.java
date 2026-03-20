package com.legalfir.service.impl;

import com.legalfir.dto.FIRDto;
import com.legalfir.dto.FIRRequest;
import com.legalfir.entity.FIR;
import com.legalfir.entity.User;
import com.legalfir.repository.FIRRepository;
import com.legalfir.service.FIRService;
import com.legalfir.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FIRServiceImpl implements FIRService {

    private final FIRRepository firRepository;
    private final NotificationService notificationService;

    @Override
    public FIRDto create(FIRRequest request, User user) {
        FIR fir = FIR.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .incidentDate(request.getIncidentDate())
                .status(FIR.Status.PENDING)
                .build();
        return toDto(firRepository.save(fir));
    }

    @Override
    public List<FIRDto> getMyFIRs(User user) {
        return firRepository.findByUser(user).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<FIRDto> getAllFIRsFlat() {
        return firRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public FIRDto getById(Long id) {
        return toDto(firRepository.findById(id).orElseThrow(() -> new RuntimeException("FIR not found")));
    }

    @Override
    public FIRDto updateStatus(Long id, FIR.Status status) {
        FIR fir = firRepository.findById(id).orElseThrow(() -> new RuntimeException("FIR not found"));
        FIR.Status oldStatus = fir.getStatus();
        fir.setStatus(status);
        FIR saved = firRepository.save(fir);
        if (status != oldStatus) {
            notificationService.send(fir.getUser(), "Your FIR #" + id + " status updated to: " + status.name());
        }
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        firRepository.deleteById(id);
    }

    @Override
    public FIRDto toDto(FIR fir) {
        FIRDto dto = new FIRDto();
        dto.setId(fir.getId());
        dto.setUserId(fir.getUser().getId());
        dto.setUserName(fir.getUser().getName());
        dto.setTitle(fir.getTitle());
        dto.setDescription(fir.getDescription());
        dto.setLocation(fir.getLocation());
        dto.setIncidentDate(fir.getIncidentDate());
        dto.setStatus(fir.getStatus());
        dto.setCreatedAt(fir.getCreatedAt());
        return dto;
    }
}
