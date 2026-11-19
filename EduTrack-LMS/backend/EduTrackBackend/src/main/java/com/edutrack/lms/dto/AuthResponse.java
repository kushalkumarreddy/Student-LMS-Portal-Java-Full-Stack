
package com.edutrack.lms.dto;

public class AuthResponse {

    private String message;
    private Long id;
    private String email;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String message, String email, String role) {
        this.message = message;
        this.email = email;
        this.role = role;
    }

    public AuthResponse(String message, Long id, String email, String role) {
        this.message = message;
        this.id = id;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
