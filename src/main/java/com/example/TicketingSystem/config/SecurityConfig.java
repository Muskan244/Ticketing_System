package com.example.TicketingSystem.config;

import com.example.TicketingSystem.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                    .authenticationEntryPoint((req, res, ex) -> res.setStatus(401))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers("/api/users/me").authenticated()
                        .requestMatchers("/api/tickets/**").authenticated()
                        .requestMatchers("/api/users/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                    .loginProcessingUrl("/api/login")
                    .loginPage("/login")
                    .successHandler((req, res, auth) -> res.setStatus(200))
                    .failureHandler((req, res, ex) -> res.setStatus(401))
                    .permitAll()
                )
                .logout(logout -> logout
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                    .permitAll()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
