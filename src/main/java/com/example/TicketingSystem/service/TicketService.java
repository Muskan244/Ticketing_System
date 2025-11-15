package com.example.TicketingSystem.service;

import com.example.TicketingSystem.dto.RatingDto;
import com.example.TicketingSystem.model.Ticket;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface TicketService {
    Ticket createTicket(Ticket ticket);
    Ticket getTicketById(Long id);
    List<Ticket> getAllTickets(Authentication authentication);
    Ticket updateTicket(Long id, Ticket ticket);
    boolean isOwner(Authentication authentication, Long id);
    List<Ticket> searchTickets(String subject, String status, String priority, Long userId, Authentication authentication);
    Ticket addRating(Long ticketId, RatingDto ratingDto, Authentication authentication);
}
