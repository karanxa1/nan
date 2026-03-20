package com.legalfir.service;

import com.legalfir.dto.DocumentDto;
import com.legalfir.entity.User;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface DocumentService {
    DocumentDto upload(Long caseId, MultipartFile file, User user) throws IOException;
    List<DocumentDto> getByCaseId(Long caseId);
    DocumentDto getById(Long id);
    void delete(Long id);
}
