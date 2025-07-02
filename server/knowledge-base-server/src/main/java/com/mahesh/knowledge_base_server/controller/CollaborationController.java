package com.mahesh.knowledge_base_server.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class CollaborationController {

    @MessageMapping("/edit-document")
    @SendTo("/topic/document-updates")
    public String broadcastDocumentUpdate(@Payload String documentUpdate, SimpMessageHeaderAccessor headerAccessor) {
        // In a real app, you would process the update and maybe persist it
        return documentUpdate;
    }
} 