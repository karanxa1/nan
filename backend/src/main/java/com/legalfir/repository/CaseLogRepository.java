package com.legalfir.repository;

import com.legalfir.entity.CaseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaseLogRepository extends JpaRepository<CaseLog, Long> {
    List<CaseLog> findByCaseEntityIdOrderByCreatedAtAsc(Long caseId);
}
