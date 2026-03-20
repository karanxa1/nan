package com.legalfir.repository;

import com.legalfir.entity.LegalSection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LegalSectionRepository extends JpaRepository<LegalSection, Long> {
    @Query("SELECT l FROM LegalSection l WHERE LOWER(l.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(l.code) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<LegalSection> search(@Param("q") String q);
    Page<LegalSection> findAll(Pageable pageable);
}
