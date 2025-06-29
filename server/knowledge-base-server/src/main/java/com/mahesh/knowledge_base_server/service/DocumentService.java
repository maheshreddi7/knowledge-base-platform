package com.mahesh.knowledge_base_server.service;

import com.mahesh.knowledge_base_server.dto.DocumentDto;
import com.mahesh.knowledge_base_server.entity.Document;
import com.mahesh.knowledge_base_server.entity.User;
import com.mahesh.knowledge_base_server.repository.DocumentRepository;
import com.mahesh.knowledge_base_server.repository.UserRepository;
import com.mahesh.knowledge_base_server.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public List<Document> getDocuments(String token) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        return documentRepository.findByAuthor(user);
    }

    public Document createDocument(String token, DocumentDto dto) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();

        Document doc = Document.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .visibility(dto.getVisibility())
                .author(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return documentRepository.save(doc);
    }

    public Document updateDocument(Long id, DocumentDto dto) {
        Document doc = documentRepository.findById(id).orElseThrow();
        doc.setTitle(dto.getTitle());
        doc.setContent(dto.getContent());
        doc.setVisibility(dto.getVisibility());
        doc.setUpdatedAt(LocalDateTime.now());
        return documentRepository.save(doc);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow();
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
