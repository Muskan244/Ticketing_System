package com.example.TicketingSystem.controller;

import com.example.TicketingSystem.model.Comment;
import com.example.TicketingSystem.model.Ticket;
import com.example.TicketingSystem.model.User;
import com.example.TicketingSystem.repository.TicketRepository;
import com.example.TicketingSystem.repository.UserRepository;
import com.example.TicketingSystem.service.CommentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, TicketRepository ticketRepository, UserRepository userRepository) {
        this.commentService = commentService;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('SUPPORT_AGENT') or @ticketServiceImpl.isOwner(authentication, #ticketId)")
    public Comment createComment(@PathVariable Long ticketId, @RequestBody Comment comment) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));

        comment.setAuthor(author);
        comment.setTicket(ticket);

        return commentService.createComment(comment);
    }
}
