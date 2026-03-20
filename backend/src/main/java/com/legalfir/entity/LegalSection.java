package com.legalfir.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "legal_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LegalSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ActType actType;

    @Column(name = "is_bailable")
    private boolean isBailable;

    public enum ActType { IPC, CrPC }
}
