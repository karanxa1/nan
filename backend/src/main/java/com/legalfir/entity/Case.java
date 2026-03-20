package com.legalfir.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fir_id", nullable = false)
    private FIR fir;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status { OPEN, ACTIVE, CLOSED }
}
