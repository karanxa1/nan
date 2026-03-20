package com.legalfir.repository;

import com.legalfir.entity.Case;
import com.legalfir.entity.FIR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CaseRepository extends JpaRepository<Case, Long> {
    Optional<Case> findByFir(FIR fir);

    @Query("SELECT c FROM Case c WHERE c.fir.user.id = :userId")
    List<Case> findByUserId(@Param("userId") Long userId);
}
