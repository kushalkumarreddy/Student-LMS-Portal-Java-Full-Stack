
package com.edutrack.lms.controller;

import com.edutrack.lms.dto.AuthResponse;
import com.edutrack.lms.dto.LoginRequest;
import com.edutrack.lms.dto.RegisterRequest;
import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.repository.UserRepository;
import com.edutrack.lms.service.AuthTokenService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService tokenService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthTokenService tokenService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        if (request.getEmail() == null ||
                request.getPassword() == null) {

            return ResponseEntity.badRequest()
                    .body("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();

        AppUser user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token = tokenService.createToken(user);

        AuthResponse response = new AuthResponse(
                "Login successful",
                user.getId(),
                user.getEmail(),
                user.getRole(),
                token
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.getEmail() == null ||
                request.getPassword() == null) {

            return ResponseEntity.badRequest()
                    .body("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        if (email.isEmpty() || !email.contains("@")) {
            return ResponseEntity.badRequest()
                    .body("Please enter a valid email address");
        }

        if (password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body("Password must contain at least 6 characters");
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email is already registered");
        }

        AppUser student = new AppUser();

        student.setEmail(email);
        student.setPassword(passwordEncoder.encode(password));
        student.setRole("STUDENT");

        AppUser savedUser = userRepository.save(student);

        String token = tokenService.createToken(savedUser);

        AuthResponse response = new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole(),
                token
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request) {

        String authorization =
                request.getHeader("Authorization");

        if (authorization != null &&
                authorization.startsWith("Bearer ")) {

            String token = authorization.substring(7);
            tokenService.removeToken(token);
        }

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
