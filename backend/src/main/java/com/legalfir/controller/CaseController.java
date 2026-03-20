package com.legalfir.controller;

import com.legalfir.dto.CaseDto;
import com.legalfir.dto.CaseLogDto;
import com.legalfir.dto.CaseRequest;
import com.legalfir.entity.Case;
import com.legalfir.entity.User;
import com.legalfir.service.CaseService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/case")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CaseDto> create(@RequestBody CaseRequest request) {
        return ResponseEntity.ok(caseService.create(request));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CaseDto>> getAll() {
        return ResponseEntity.ok(caseService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<CaseDto>> getMyCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.getMyCases(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CaseDto> updateStatus(@PathVariable Long id,
                                                @RequestBody StatusRequest request) {
        CaseRequest cr = new CaseRequest();
        cr.setStatus(Case.Status.valueOf(request.getStatus()));
        return ResponseEntity.ok(caseService.update(id, cr, null));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CaseDto> update(@PathVariable Long id,
                                          @RequestBody CaseRequest request,
                                          @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(caseService.update(id, request, admin));
    }

    @PostMapping("/{id}/log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CaseLogDto> addLog(@PathVariable Long id,
                                             @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(caseService.addLog(id, body.get("note")));
    }

    public static class StatusRequest {
        @JsonProperty("status")
        private String status;
        public StatusRequest() {}
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
