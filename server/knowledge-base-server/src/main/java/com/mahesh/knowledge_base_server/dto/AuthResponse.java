// AuthResponse.java
package com.mahesh.knowledge_base_server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
