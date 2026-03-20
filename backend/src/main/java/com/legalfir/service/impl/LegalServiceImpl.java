package com.legalfir.service.impl;

import com.legalfir.dto.LegalSectionDto;
import com.legalfir.entity.LegalSection;
import com.legalfir.repository.LegalSectionRepository;
import com.legalfir.service.LegalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LegalServiceImpl implements LegalService {

    private final LegalSectionRepository legalSectionRepository;

    @Override
    public List<LegalSectionDto> getAll(int page, int size) {
        return legalSectionRepository.findAll(PageRequest.of(page, size))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<LegalSectionDto> search(String q) {
        return legalSectionRepository.search(q).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public LegalSectionDto getById(Long id) {
        return toDto(legalSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found")));
    }

    @Override
    public Map<String, Object> checkBail(Long id) {
        LegalSection section = legalSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        return Map.of("eligible", section.isBailable(), "section", toDto(section));
    }

    @Override
    public LegalSectionDto create(LegalSectionDto dto) {
        LegalSection section = toEntity(dto);
        return toDto(legalSectionRepository.save(section));
    }

    @Override
    public LegalSectionDto update(Long id, LegalSectionDto dto) {
        LegalSection section = legalSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        if (dto.getCode() != null) section.setCode(dto.getCode());
        if (dto.getTitle() != null) section.setTitle(dto.getTitle());
        if (dto.getDescription() != null) section.setDescription(dto.getDescription());
        if (dto.getActType() != null) section.setActType(dto.getActType());
        section.setBailable(dto.isBailable());
        return toDto(legalSectionRepository.save(section));
    }

    @Override
    public void delete(Long id) {
        legalSectionRepository.deleteById(id);
    }

    private LegalSectionDto toDto(LegalSection s) {
        LegalSectionDto dto = new LegalSectionDto();
        dto.setId(s.getId());
        dto.setCode(s.getCode());
        dto.setTitle(s.getTitle());
        dto.setDescription(s.getDescription());
        dto.setActType(s.getActType());
        dto.setBailable(s.isBailable());
        return dto;
    }

    private LegalSection toEntity(LegalSectionDto dto) {
        LegalSection s = new LegalSection();
        s.setCode(dto.getCode());
        s.setTitle(dto.getTitle());
        s.setDescription(dto.getDescription());
        s.setActType(dto.getActType());
        s.setBailable(dto.isBailable());
        return s;
    }
}
