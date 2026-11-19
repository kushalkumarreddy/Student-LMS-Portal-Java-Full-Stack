
package com.edutrack.lms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.StudentResponse;
import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.repository.AuthSessionRepository;
import com.edutrack.lms.repository.EnrollmentRepository;
import com.edutrack.lms.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AdminController {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AuthSessionRepository sessionRepository;

    public AdminController(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            AuthSessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.sessionRepository = sessionRepository;
    }

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

    @Transactional
    @DeleteMapping("/students/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        AppUser student = userRepository.findById(id)
                .orElse(null);

        if (student == null ||
                !"STUDENT".equals(student.getRole())) {

            return ResponseEntity.notFound().build();
        }

        enrollmentRepository.deleteAllByStudent_Id(id);
        sessionRepository.deleteAllByUserId(id);
        userRepository.delete(student);

        return ResponseEntity.ok(
                "Student deleted successfully"
        );
    }
}
