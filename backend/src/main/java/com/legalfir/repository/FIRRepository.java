package com.legalfir.repository;

import com.legalfir.entity.FIR;
import com.legalfir.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FIRRepository extends JpaRepository<FIR, Long> {
    List<FIR> findByUser(User user);
    Page<FIR> findAll(Pageable pageable);
}
