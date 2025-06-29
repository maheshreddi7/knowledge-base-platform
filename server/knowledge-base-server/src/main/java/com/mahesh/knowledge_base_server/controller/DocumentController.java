package com.mahesh.knowledge_base_server.controller;

import com.mahesh.knowledge_base_server.dto.DocumentDto;
import com.mahesh.knowledge_base_server.entity.Document;
import com.mahesh.knowledge_base_server.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // Constructor log
    public DocumentController() {
        System.out.println("✅ DocumentController loaded");
    }

    @PostMapping
    public ResponseEntity<Document> create(@RequestHeader("Authorization") String token,
                                           @RequestBody DocumentDto dto) {
        System.out.println("📥 POST /api/documents hit");

        token = token.replace("Bearer ", "");
        return ResponseEntity.ok(documentService.createDocument(token, dto));
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAll(@RequestHeader("Authorization") String token) {
        System.out.println("📄 GET /api/documents hit");

        token = token.replace("Bearer ", "");
        return ResponseEntity.ok(documentService.getDocuments(token));
    }
}
