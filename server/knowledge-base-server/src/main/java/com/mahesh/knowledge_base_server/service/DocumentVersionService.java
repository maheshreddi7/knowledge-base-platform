package com.mahesh.knowledge_base_server.service;

import com.mahesh.knowledge_base_server.dto.DocumentVersionDto;
import com.mahesh.knowledge_base_server.entity.DocumentVersion;
import com.mahesh.knowledge_base_server.entity.Document;
import com.mahesh.knowledge_base_server.entity.User;
import com.mahesh.knowledge_base_server.repository.DocumentVersionRepository;
import com.mahesh.knowledge_base_server.repository.DocumentRepository;
import com.mahesh.knowledge_base_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentVersionService {
    @Autowired
    private DocumentVersionRepository versionRepository;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private UserRepository userRepository;

    public List<DocumentVersionDto> getVersionsByDocument(Long documentId) {
        return versionRepository.findByDocumentIdOrderByVersionDesc(documentId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public DocumentVersionDto addVersion(Long documentId, String content, Long authorId) {
        Optional<Document> docOpt = documentRepository.findById(documentId);
        Optional<User> userOpt = userRepository.findById(authorId);
        if (docOpt.isPresent() && userOpt.isPresent()) {
            Document doc = docOpt.get();
            int nextVersion = versionRepository.findByDocumentIdOrderByVersionDesc(documentId).stream()
                .mapToInt(DocumentVersion::getVersion).max().orElse(0) + 1;
            DocumentVersion version = new DocumentVersion();
            version.setDocument(doc);
            version.setContent(content);
            version.setVersion(nextVersion);
            version.setAuthor(userOpt.get());
            version.setCreatedAt(LocalDateTime.now());
            version.setUpdatedAt(LocalDateTime.now());
            return toDto(versionRepository.save(version));
        }
        return null;
    }

    public DocumentVersionDto restoreVersion(Long versionId) {
        Optional<DocumentVersion> versionOpt = versionRepository.findById(versionId);
        if (versionOpt.isPresent()) {
            DocumentVersion version = versionOpt.get();
            Document doc = version.getDocument();
            doc.setContent(version.getContent());
            documentRepository.save(doc);
            return toDto(version);
        }
        return null;
    }

    private DocumentVersionDto toDto(DocumentVersion version) {
        DocumentVersionDto dto = new DocumentVersionDto();
        dto.setId(version.getId());
        dto.setDocumentId(version.getDocument() != null ? version.getDocument().getId() : null);
        dto.setContent(version.getContent());
        dto.setVersion(version.getVersion());
        dto.setAuthorId(version.getAuthor() != null ? version.getAuthor().getId() : null);
        dto.setCreatedAt(version.getCreatedAt());
        dto.setUpdatedAt(version.getUpdatedAt());
        return dto;
    }
} 