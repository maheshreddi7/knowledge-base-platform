package com.mahesh.knowledge_base_server.repository;

import com.mahesh.knowledge_base_server.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDocumentId(Long documentId);
} 