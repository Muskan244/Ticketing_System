package com.example.TicketingSystem.repository;

import com.example.TicketingSystem.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TicketingSystem.model.Ticket;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicket(Ticket ticket);
}
