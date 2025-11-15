package com.example.TicketingSystem.service;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
}
