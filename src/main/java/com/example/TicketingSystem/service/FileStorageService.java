package com.example.TicketingSystem.service;

import com.example.TicketingSystem.model.Ticket;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    void init();
    String storeFile(MultipartFile file, Ticket ticket);
    Resource loadFileAsResource(String fileName);
}
