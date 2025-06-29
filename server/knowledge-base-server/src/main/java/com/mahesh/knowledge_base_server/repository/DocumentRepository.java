package com.mahesh.knowledge_base_server.repository;

import com.mahesh.knowledge_base_server.entity.Document;
import com.mahesh.knowledge_base_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByAuthor(User user);
    List<Document> findByVisibility(String visibility);
}
