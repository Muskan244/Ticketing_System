package com.example.TicketingSystem.repository;

import com.example.TicketingSystem.model.Ticket;
import com.example.TicketingSystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    List<Ticket> findByRequester(User requester);
    List<Ticket> findByAssignee(User assignee);
}
