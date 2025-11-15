package com.example.TicketingSystem.service;

import com.example.TicketingSystem.model.Ticket;
import com.example.TicketingSystem.model.User;
import com.example.TicketingSystem.repository.CommentRepository;
import com.example.TicketingSystem.repository.TicketRepository;
import com.example.TicketingSystem.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

        private final UserRepository userRepository;
            private final PasswordEncoder passwordEncoder;
            private final TicketRepository ticketRepository;
            private final CommentRepository commentRepository;
        
            public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, TicketRepository ticketRepository, CommentRepository commentRepository) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.ticketRepository = ticketRepository;
                this.commentRepository = commentRepository;
            }
        
            @Override
            public User createUser(User user) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                return userRepository.save(user);
            }
        
            @Override
            public List<User> getAllUsers() {
                return userRepository.findAll();
            }
        
            @Override
            public User updateUserRole(Long id, com.example.TicketingSystem.enums.Role role) {
                User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
                existingUser.setRole(role);
                return userRepository.save(existingUser);
            }
        
                @Override
                public User getUserByUsername(String username) {
                    return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
                }
            
                @Override
                public void deleteUser(Long id) {                User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
                        // Delete tickets where the user is the requester
                        List<Ticket> ticketsAsRequester = ticketRepository.findByRequester(user);
                        ticketRepository.deleteAll(ticketsAsRequester);
                
                        List<Ticket> ticketsAsAssignee = ticketRepository.findByAssignee(user);
                for (Ticket ticket : ticketsAsAssignee) {
                    ticket.setAssignee(null);
                    ticketRepository.save(ticket);
                }
        
                userRepository.delete(user);
            }}
