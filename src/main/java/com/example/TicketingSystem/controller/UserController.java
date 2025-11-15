package com.example.TicketingSystem.controller;

import com.example.TicketingSystem.model.User;
import com.example.TicketingSystem.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User updateUserRole(@PathVariable Long id, @RequestBody com.example.TicketingSystem.enums.Role role) {
        return userService.updateUserRole(id, role);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User getMe(Authentication authentication) {
        return userService.getUserByUsername(authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}
