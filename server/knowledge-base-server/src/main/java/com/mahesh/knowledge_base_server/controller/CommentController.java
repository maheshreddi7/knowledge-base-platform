package com.mahesh.knowledge_base_server.controller;

import com.mahesh.knowledge_base_server.dto.CommentDto;
import com.mahesh.knowledge_base_server.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/document/{documentId}")
    public List<CommentDto> getCommentsByDocument(@PathVariable Long documentId) {
        return commentService.getCommentsByDocument(documentId);
    }

    @PostMapping
    public CommentDto addComment(@RequestBody CommentDto dto) {
        return commentService.addComment(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
} 