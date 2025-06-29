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

    @GetMapping("/search")
    public ResponseEntity<List<Document>> search(@RequestHeader("Authorization") String token,
                                                @RequestParam String query) {
        System.out.println("🔍 GET /api/documents/search hit with query: " + query);

        token = token.replace("Bearer ", "");
        return ResponseEntity.ok(documentService.searchDocuments(token, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getById(@RequestHeader("Authorization") String token,
                                           @PathVariable Long id) {
        System.out.println("📄 GET /api/documents/" + id + " hit");

        token = token.replace("Bearer ", "");
        return ResponseEntity.ok(documentService.getDocumentById(token, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestHeader("Authorization") String token,
                                          @PathVariable Long id,
                                          @RequestBody DocumentDto dto) {
        System.out.println("✏️ PUT /api/documents/" + id + " hit");
        System.out.println("Request body: " + dto);

        try {
            token = token.replace("Bearer ", "");
            Document updatedDoc = documentService.updateDocument(token, id, dto);
            System.out.println("✅ Document updated successfully");
            return ResponseEntity.ok(updatedDoc);
        } catch (Exception e) {
            System.err.println("❌ Error updating document: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating document: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@RequestHeader("Authorization") String token,
                                      @PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/documents/" + id + " hit");

        try {
            token = token.replace("Bearer ", "");
            documentService.deleteDocument(token, id);
            System.out.println("✅ Document deleted successfully: " + id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("❌ Error deleting document: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error deleting document: " + e.getMessage());
        }
    }
}
