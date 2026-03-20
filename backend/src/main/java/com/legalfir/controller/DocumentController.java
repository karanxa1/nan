package com.legalfir.controller;

import com.legalfir.dto.DocumentDto;
import com.legalfir.entity.Document;
import com.legalfir.entity.User;
import com.legalfir.repository.DocumentRepository;
import com.legalfir.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/document")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final DocumentRepository documentRepository;

    @PostMapping("/upload/{caseId}")
    public ResponseEntity<DocumentDto> upload(@PathVariable Long caseId,
                                               @RequestParam("file") MultipartFile file,
                                               @AuthenticationPrincipal User user) throws IOException {
        return ResponseEntity.ok(documentService.upload(caseId, file, user));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<DocumentDto>> getByCaseId(@PathVariable Long caseId) {
        return ResponseEntity.ok(documentService.getByCaseId(caseId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<InputStreamResource> download(@PathVariable Long id) throws IOException {
        DocumentDto dto = documentService.getById(id);
        Document doc = documentRepository.findById(id).orElseThrow();
        FileInputStream fis = new FileInputStream(doc.getFilePath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(fis));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
