package com.timetracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.timetracker.model.User;
import com.timetracker.repository.UserRepository;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String username, String password, String fullName, String email, com.timetracker.model.UserRole role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // plain text for dev (matches existing login logic)
        user.setFullName(fullName != null ? fullName : username);
        user.setEmail(email);
        user.setRole(role);
        return userRepository.save(user);
    }

    public boolean login(String username, String password) {
        Optional<User> opt = userRepository.findByUsername(username);
        if (opt.isEmpty()) {
            System.out.println("User not found: " + username);
            return false;
        }
        User user = opt.get();
        System.out.println("Found user: " + username + ", checking password");
        
        // Simple plain text comparison for development
        if (!password.equals(user.getPassword())) {
            System.out.println("Password mismatch. Expected: " + user.getPassword() + ", Got: " + password);
            return false;
        }

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
        System.out.println("Login successful for user: " + username);
        return true;
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof User) return (User) principal;
        if (principal instanceof String username) {
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }
}