
package com.edutrack.lms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.StudentResponse;
import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all registered students
    @GetMapping("/students")
    public List<StudentResponse> getAllStudents() {

        return userRepository.findAllByRole("STUDENT")
                .stream()
                .map(user -> new StudentResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    // Delete a student
    @DeleteMapping("/students/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {

        AppUser student = userRepository.findById(id).orElse(null);

        if (student == null || !"STUDENT".equals(student.getRole())) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(student);

        return ResponseEntity.ok("Student deleted successfully");
    }
}
