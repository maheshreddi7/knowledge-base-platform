package com.mahesh.knowledge_base_server.repository;

import com.mahesh.knowledge_base_server.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    List<DocumentVersion> findByDocumentIdOrderByVersionDesc(Long documentId);
} 