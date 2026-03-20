package com.legalfir.controller;

import com.legalfir.dto.FIRDto;
import com.legalfir.dto.ReportSummaryDto;
import com.legalfir.entity.FIR;
import com.legalfir.repository.CaseRepository;
import com.legalfir.repository.FIRRepository;
import com.legalfir.repository.UserRepository;
import com.legalfir.service.FIRService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final FIRRepository firRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final FIRService firService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDto> summary() {
        return ResponseEntity.ok(new ReportSummaryDto(
                firRepository.count(),
                caseRepository.count(),
                userRepository.count()
        ));
    }

    @GetMapping("/fir-stats")
    public ResponseEntity<Map<String, Long>> firStats() {
        Map<String, Long> stats = Map.of(
                "PENDING", firRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FIR.Status.PENDING).count(),
                "UNDER_INVESTIGATION", firRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FIR.Status.UNDER_INVESTIGATION).count(),
                "CLOSED", firRepository.findAll().stream()
                        .filter(f -> f.getStatus() == FIR.Status.CLOSED).count()
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user-activity")
    public ResponseEntity<List<FIRDto>> userActivity() {
        List<FIRDto> recent = firRepository.findAll(PageRequest.of(0, 10))
                .stream().map(firService::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(recent);
    }
}
