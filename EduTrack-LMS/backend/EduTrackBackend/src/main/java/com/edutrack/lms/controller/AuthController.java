package com.edutrack.lms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.AuthResponse;
import com.edutrack.lms.dto.LoginRequest;
import com.edutrack.lms.dto.RegisterRequest;
import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();

        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        AuthResponse response = new AuthResponse(
                "Login successful",
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    // STUDENT REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if (email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (password.length() < 8) {
            return ResponseEntity.badRequest()
                    .body("Password must contain at least 8 characters");
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email is already registered");
        }

        AppUser student = new AppUser(
                email,
                passwordEncoder.encode(password),
                "STUDENT"
        );

        AppUser savedUser = userRepository.save(student);

        AuthResponse response = new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}