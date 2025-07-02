package com.mahesh.knowledge_base_server.dto;

import java.util.List;

public class SpaceDto {
    private Long id;
    private String name;
    private String description;
    private List<Long> documentIds;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Long> getDocumentIds() { return documentIds; }
    public void setDocumentIds(List<Long> documentIds) { this.documentIds = documentIds; }
} 