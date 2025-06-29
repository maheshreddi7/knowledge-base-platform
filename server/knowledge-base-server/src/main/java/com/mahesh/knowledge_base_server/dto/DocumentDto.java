package com.mahesh.knowledge_base_server.dto;

import lombok.Data;

@Data
public class DocumentDto {
    private String title;
    private String content;
    private String visibility;
}
