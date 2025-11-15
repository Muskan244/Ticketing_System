package com.example.TicketingSystem.controller;

import com.example.TicketingSystem.dto.RatingDto;
import com.example.TicketingSystem.model.Ticket;
import com.example.TicketingSystem.model.User;
import com.example.TicketingSystem.repository.UserRepository;
import com.example.TicketingSystem.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Ticket createTicket(@RequestBody Ticket ticket) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        ticket.setRequester(requester);
        return ticketService.createTicket(ticket);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Ticket> getAllTickets(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {
        return ticketService.searchTickets(subject, status, priority, userId, authentication);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('SUPPORT_AGENT')")
    public Ticket updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return ticketService.updateTicket(id, ticket);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('SUPPORT_AGENT') or @ticketServiceImpl.isOwner(authentication, #id)")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping("/{id}/rate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Ticket> rateTicket(@PathVariable Long id, @RequestBody RatingDto ratingDto, Authentication authentication) {
        try {
            Ticket updatedTicket = ticketService.addRating(id, ratingDto, authentication);
            return ResponseEntity.ok(updatedTicket);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).build();
        }
    }
}
