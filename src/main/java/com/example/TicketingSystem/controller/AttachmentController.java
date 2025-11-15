package com.example.TicketingSystem.controller;

import com.example.TicketingSystem.model.Attachment;
import com.example.TicketingSystem.model.Ticket;
import com.example.TicketingSystem.repository.AttachmentRepository;
import com.example.TicketingSystem.service.FileStorageService;
import com.example.TicketingSystem.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api")
public class AttachmentController {

    private final FileStorageService fileStorageService;
    private final TicketService ticketService;
    private final AttachmentRepository attachmentRepository;

    @Autowired
    public AttachmentController(FileStorageService fileStorageService, TicketService ticketService, AttachmentRepository attachmentRepository) {
        this.fileStorageService = fileStorageService;
        this.ticketService = ticketService;
        this.attachmentRepository = attachmentRepository;
    }

    @PostMapping("/tickets/{ticketId}/attachments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadFile(@PathVariable Long ticketId, @RequestParam("file") MultipartFile file) {
        Ticket ticket = ticketService.getTicketById(ticketId);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }

        fileStorageService.storeFile(file, ticket);
        return ResponseEntity.ok("File uploaded successfully");
    }

    @GetMapping("/attachments/{attachmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long attachmentId, HttpServletRequest request) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        Resource resource = fileStorageService.loadFileAsResource(attachment.getFileName());

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // fallback to the default content type if type could not be determined
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
