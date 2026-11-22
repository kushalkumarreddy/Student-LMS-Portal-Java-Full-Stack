
package com.edutrack.lms.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.EnrollmentRequest;
import com.edutrack.lms.dto.EnrollmentResponse;
import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.entity.Course;
import com.edutrack.lms.entity.Enrollment;
import com.edutrack.lms.repository.CourseRepository;
import com.edutrack.lms.repository.EnrollmentRepository;
import com.edutrack.lms.repository.UserRepository;
import com.edutrack.lms.service.AuthTokenService.TokenData;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentController(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @PostMapping
    public ResponseEntity<?> enroll(
            @RequestBody EnrollmentRequest request,
            Authentication authentication) {

        TokenData currentUser = getCurrentUser(authentication);

        if (currentUser == null ||
                !"STUDENT".equals(currentUser.role())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only students can enroll in courses."
                    ));
        }

        if (request.getCourseId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Course ID is required."
                    ));
        }

        Long studentId = currentUser.id();

        AppUser student = userRepository.findById(studentId)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Student account not found."
                    ));
        }

        Course course = courseRepository.findById(
                request.getCourseId()
        ).orElse(null);

        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Course not found."
                    ));
        }

        if (enrollmentRepository.existsByStudent_IdAndCourse_Id(
                studentId,
                course.getId())) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "You are already enrolled in this course."
                    ));
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());

        Enrollment saved = enrollmentRepository.save(enrollment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentEnrollments(
            @PathVariable Long studentId,
            Authentication authentication) {

        TokenData currentUser = getCurrentUser(authentication);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please sign in."
                    ));
        }

        boolean isAdmin = "ADMIN".equals(currentUser.role());

        boolean isOwnAccount = currentUser.id().equals(studentId);

        if (!isAdmin && !isOwnAccount) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You cannot access another student's enrollments."
                    ));
        }

        List<EnrollmentResponse> result =
                enrollmentRepository.findAllByStudent_Id(studentId)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(result);
    }

    private TokenData getCurrentUser(
            Authentication authentication) {

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof TokenData)) {

            return null;
        }

        return (TokenData) authentication.getPrincipal();
    }

    private EnrollmentResponse toResponse(
            Enrollment enrollment) {

        EnrollmentResponse response = new EnrollmentResponse();

        response.setId(enrollment.getId());
        response.setCourseId(enrollment.getCourse().getId());
        response.setTitle(enrollment.getCourse().getTitle());
        response.setDescription(enrollment.getCourse().getDescription());
        response.setInstructor(enrollment.getCourse().getInstructor());
        response.setDuration(enrollment.getCourse().getDuration());
        response.setEnrolledAt(enrollment.getEnrolledAt());

        return response;
    }
}
