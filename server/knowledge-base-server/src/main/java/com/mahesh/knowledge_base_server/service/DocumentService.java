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

    public List<Document> searchDocuments(String token, String query) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        
        // Search in both title and content
        return documentRepository.findByAuthorAndTitleContainingIgnoreCaseOrAuthorAndContentContainingIgnoreCase(
            user, query, user, query);
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
                .version(1)
                .lastModifiedBy(user.getEmail())
                .lastModifiedAt(LocalDateTime.now())
                .build();

        return documentRepository.save(doc);
    }

    public Document updateDocument(String token, Long id, DocumentDto dto) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Document doc = documentRepository.findById(id).orElseThrow();
        
        // Check if user is the author
        if (!doc.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only edit your own documents");
        }
        
        // Increment version if content or title changed
        boolean contentChanged = !doc.getContent().equals(dto.getContent()) || 
                               !doc.getTitle().equals(dto.getTitle());
        
        if (contentChanged) {
            doc.setVersion(doc.getVersion() + 1);
        }
        
        doc.setTitle(dto.getTitle());
        doc.setContent(dto.getContent());
        doc.setVisibility(dto.getVisibility());
        doc.setUpdatedAt(LocalDateTime.now());
        doc.setLastModifiedBy(user.getEmail());
        doc.setLastModifiedAt(LocalDateTime.now());
        
        return documentRepository.save(doc);
    }

    public Document getDocumentById(String token, Long id) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Document doc = documentRepository.findById(id).orElseThrow();
        
        // Check if user is the author (for now, only authors can view their documents)
        if (!doc.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only view your own documents");
        }
        
        return doc;
    }

    public void deleteDocument(String token, Long id) {
        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Document doc = documentRepository.findById(id).orElseThrow();
        
        // Check if user is the author
        if (!doc.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own documents");
        }
        
        documentRepository.deleteById(id);
    }
}
