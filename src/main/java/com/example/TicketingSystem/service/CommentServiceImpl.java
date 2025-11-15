package com.example.TicketingSystem.service;

import com.example.TicketingSystem.model.Comment;
import com.example.TicketingSystem.repository.CommentRepository;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }
}
