package com.legalfir.service.impl;

import com.legalfir.dto.DocumentDto;
import com.legalfir.entity.Case;
import com.legalfir.entity.Document;
import com.legalfir.entity.User;
import com.legalfir.repository.CaseRepository;
import com.legalfir.repository.DocumentRepository;
import com.legalfir.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private static final String UPLOAD_DIR = "uploads/";

    @Override
    public DocumentDto upload(Long caseId, MultipartFile file, User user) throws IOException {
        Case c = caseRepository.findById(caseId).orElseThrow(() -> new RuntimeException("Case not found"));
        Path dir = Paths.get(UPLOAD_DIR + caseId);
        Files.createDirectories(dir);
        String originalName = file.getOriginalFilename();
        Path filePath = dir.resolve(originalName);
        Files.write(filePath, file.getBytes());
        Document doc = Document.builder()
                .caseEntity(c)
                .user(user)
                .fileName(originalName)
                .filePath(filePath.toString())
                .build();
        return toDto(documentRepository.save(doc));
    }

    @Override
    public List<DocumentDto> getByCaseId(Long caseId) {
        return documentRepository.findByCaseEntityId(caseId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public DocumentDto getById(Long id) {
        return toDto(documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found")));
    }

    @Override
    public void delete(Long id) {
        Document doc = documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
        try { Files.deleteIfExists(Paths.get(doc.getFilePath())); } catch (IOException ignored) {}
        documentRepository.delete(doc);
    }

    private DocumentDto toDto(Document d) {
        DocumentDto dto = new DocumentDto();
        dto.setId(d.getId());
        dto.setCaseId(d.getCaseEntity().getId());
        dto.setUserId(d.getUser().getId());
        dto.setUserName(d.getUser().getName());
        dto.setFileName(d.getFileName());
        dto.setUploadedAt(d.getUploadedAt());
        return dto;
    }
}
