package com.legalfir.controller;

import com.legalfir.dto.FIRDto;
import com.legalfir.dto.FIRRequest;
import com.legalfir.entity.FIR;
import com.legalfir.entity.User;
import com.legalfir.service.FIRService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fir")
@RequiredArgsConstructor
public class FIRController {

    private final FIRService firService;

    @PostMapping
    public ResponseEntity<FIRDto> create(@RequestBody FIRRequest request,
                                         @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(firService.create(request, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<FIRDto>> getMyFIRs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(firService.getMyFIRs(user));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FIRDto>> getAllFIRs() {
        return ResponseEntity.ok(firService.getAllFIRsFlat());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FIRDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(firService.getById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FIRDto> updateStatus(@PathVariable Long id,
                                               @RequestBody StatusRequest request) {
        return ResponseEntity.ok(firService.updateStatus(id, FIR.Status.valueOf(request.getStatus())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        firService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public static class StatusRequest {
        private String status;
        public StatusRequest() {}
        @JsonProperty("status")
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
