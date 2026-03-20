package com.legalfir.controller;

import com.legalfir.dto.LegalSectionDto;
import com.legalfir.service.LegalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/legal")
@RequiredArgsConstructor
public class LegalController {

    private final LegalService legalService;

    @GetMapping
    public ResponseEntity<List<LegalSectionDto>> getAll() {
        return ResponseEntity.ok(legalService.getAll(0, 200));
    }

    @GetMapping("/search")
    public ResponseEntity<List<LegalSectionDto>> search(@RequestParam String q) {
        return ResponseEntity.ok(legalService.search(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LegalSectionDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(legalService.getById(id));
    }

    @GetMapping("/{id}/bail")
    public ResponseEntity<Map<String, Object>> checkBail(@PathVariable Long id) {
        return ResponseEntity.ok(legalService.checkBail(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LegalSectionDto> create(@RequestBody LegalSectionDto dto) {
        return ResponseEntity.ok(legalService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LegalSectionDto> update(@PathVariable Long id,
                                                   @RequestBody LegalSectionDto dto) {
        return ResponseEntity.ok(legalService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        legalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
