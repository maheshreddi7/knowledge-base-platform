package com.mahesh.knowledge_base_server.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String visibility; // "PUBLIC" or "PRIVATE"

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Version tracking
    private Integer version = 1;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;
}
