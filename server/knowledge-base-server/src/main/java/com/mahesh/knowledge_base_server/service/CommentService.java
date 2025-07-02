package com.mahesh.knowledge_base_server.service;

import com.mahesh.knowledge_base_server.dto.CommentDto;
import com.mahesh.knowledge_base_server.entity.Comment;
import com.mahesh.knowledge_base_server.entity.Document;
import com.mahesh.knowledge_base_server.entity.User;
import com.mahesh.knowledge_base_server.repository.CommentRepository;
import com.mahesh.knowledge_base_server.repository.DocumentRepository;
import com.mahesh.knowledge_base_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private UserRepository userRepository;

    public List<CommentDto> getCommentsByDocument(Long documentId) {
        return commentRepository.findByDocumentId(documentId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public CommentDto addComment(CommentDto dto) {
        Optional<Document> docOpt = documentRepository.findById(dto.getDocumentId());
        Optional<User> userOpt = userRepository.findById(dto.getAuthorId());
        if (docOpt.isPresent() && userOpt.isPresent()) {
            Comment comment = new Comment();
            comment.setText(dto.getText());
            comment.setDocument(docOpt.get());
            comment.setAuthor(userOpt.get());
            comment.setCreatedAt(LocalDateTime.now());
            comment.setUpdatedAt(LocalDateTime.now());
            return toDto(commentRepository.save(comment));
        }
        return null;
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    private CommentDto toDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setAuthorId(comment.getAuthor() != null ? comment.getAuthor().getId() : null);
        dto.setDocumentId(comment.getDocument() != null ? comment.getDocument().getId() : null);
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
} 