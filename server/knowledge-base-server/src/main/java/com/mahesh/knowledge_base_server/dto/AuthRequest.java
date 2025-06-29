// AuthRequest.java
package com.mahesh.knowledge_base_server.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
