package com.example.TicketingSystem.service;

import com.example.TicketingSystem.dto.RatingDto;
import com.example.TicketingSystem.enums.Status;
import com.example.TicketingSystem.model.Ticket;
import com.example.TicketingSystem.repository.TicketRepository;
import com.example.TicketingSystem.model.User;
import com.example.TicketingSystem.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service("ticketServiceImpl")
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public TicketServiceImpl(TicketRepository ticketRepository, UserRepository userRepository, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
        Ticket newTicket = ticketRepository.save(ticket);
        if (newTicket.getRequester() != null && newTicket.getRequester().getEmail() != null) {
            String subject = String.format("Ticket #%d Created: %s", newTicket.getId(), newTicket.getSubject());
            String text = String.format("Hello %s,\n\nYour ticket with the subject '%s' has been successfully created.\n\nThank you,\nThe Ticketing System Team", newTicket.getRequester().getUsername(), newTicket.getSubject());
            emailService.sendSimpleMessage(newTicket.getRequester().getEmail(), subject, text);
        }
        return newTicket;
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    @Override
    public List<Ticket> getAllTickets(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("SUPPORT_AGENT"))) {
            return ticketRepository.findAll();
        } else {
            return ticketRepository.findByRequester(user);
        }
    }

    @Override
    public Ticket updateTicket(Long id, Ticket ticket) {
        Ticket existingTicket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Check for status change
        if (ticket.getStatus() != null && !ticket.getStatus().equals(existingTicket.getStatus())) {
            if (existingTicket.getRequester() != null && existingTicket.getRequester().getEmail() != null) {
                String subject = String.format("Ticket #%d Status Updated: %s", existingTicket.getId(), existingTicket.getSubject());
                String text = String.format("Hello %s,\n\nThe status of your ticket '%s' has been updated to %s.", existingTicket.getRequester().getUsername(), existingTicket.getSubject(), ticket.getStatus());
                emailService.sendSimpleMessage(existingTicket.getRequester().getEmail(), subject, text);
            }
        }

        // Check for assignee change
        if (ticket.getAssignee() != null && !ticket.getAssignee().equals(existingTicket.getAssignee())) {
            if (ticket.getAssignee().getEmail() != null) {
                String subject = String.format("You have been assigned to Ticket #%d: %s", existingTicket.getId(), existingTicket.getSubject());
                String text = String.format("Hello %s,\n\nYou have been assigned to a new ticket with the subject '%s'.", ticket.getAssignee().getUsername(), existingTicket.getSubject());
                emailService.sendSimpleMessage(ticket.getAssignee().getEmail(), subject, text);
            }
        }

        if (ticket.getSubject() != null) {
            existingTicket.setSubject(ticket.getSubject());
        }
        if (ticket.getDescription() != null) {
            existingTicket.setDescription(ticket.getDescription());
        }
        if (ticket.getPriority() != null) {
            existingTicket.setPriority(ticket.getPriority());
        }
        if (ticket.getStatus() != null) {
            existingTicket.setStatus(ticket.getStatus());
        }
        if (ticket.getAssignee() != null) {
            existingTicket.setAssignee(ticket.getAssignee());
        }

        return ticketRepository.save(existingTicket);
    }

    @Override
    public boolean isOwner(Authentication authentication, Long id) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return false;
        }
        return ticket.getRequester().getUsername().equals(authentication.getName());
    }

    @Override
    public List<Ticket> searchTickets(String subject, String status, String priority, Long userId, Authentication authentication) {
        Specification<Ticket> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (subject != null && !subject.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("subject")), "%" + subject.toLowerCase() + "%"));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("status"), com.example.TicketingSystem.enums.Status.valueOf(status.toUpperCase())));
            }
            if (priority != null && !priority.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), com.example.TicketingSystem.enums.Priority.valueOf(priority.toUpperCase())));
            }
            if (userId != null) {
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    predicates.add(criteriaBuilder.equal(root.get("requester"), user));
                }
            }

            // Authorization
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
            boolean isAdminOrSupport = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("SUPPORT_AGENT"));

            if (!isAdminOrSupport) {
                predicates.add(criteriaBuilder.equal(root.get("requester"), currentUser));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return ticketRepository.findAll(spec);
    }

    @Override
    public Ticket addRating(Long ticketId, RatingDto ratingDto, Authentication authentication) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Ensure the user is the requester of the ticket
        if (!ticket.getRequester().getUsername().equals(authentication.getName())) {
            throw new AccessDeniedException("You are not authorized to rate this ticket.");
        }

        // Ensure the ticket is resolved or closed
        if (ticket.getStatus() != Status.RESOLVED && ticket.getStatus() != Status.CLOSED) {
            throw new IllegalStateException("You can only rate resolved or closed tickets.");
        }

        ticket.setRating(ratingDto.getRating());
        ticket.setFeedback(ratingDto.getFeedback());

        return ticketRepository.save(ticket);
    }
}
