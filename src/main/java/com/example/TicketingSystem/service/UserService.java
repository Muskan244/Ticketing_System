package com.example.TicketingSystem.service;

import com.example.TicketingSystem.model.User;

import java.util.List;

import com.example.TicketingSystem.enums.Role;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    void deleteUser(Long id);
    User updateUserRole(Long id, Role role);
    User getUserByUsername(String username);
}
