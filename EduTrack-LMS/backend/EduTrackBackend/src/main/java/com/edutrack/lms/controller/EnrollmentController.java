
package com.edutrack.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.EnrollmentRequest;
import com.edutrack.lms.dto.EnrollmentResponse;
import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.entity.Course;
import com.edutrack.lms.entity.Enrollment;
import com.edutrack.lms.repository.UserRepository;
import com.edutrack.lms.repository.CourseRepository;
import com.edutrack.lms.repository.EnrollmentRepository;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
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

    // Enroll a student in a course
    @PostMapping
    public ResponseEntity<?> enrollStudent(
            @RequestBody EnrollmentRequest request) {

        if (request.getStudentId() == null ||
            request.getCourseId() == null) {

            return ResponseEntity.badRequest()
                    .body("Student ID and Course ID are required");
        }

        AppUser student = userRepository
                .findById(request.getStudentId())
                .orElse(null);

        if (student == null ||
            !"STUDENT".equals(student.getRole())) {

            return ResponseEntity.badRequest()
                    .body("Invalid student account");
        }

        Course course = courseRepository
                .findById(request.getCourseId())
                .orElse(null);

        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        boolean alreadyEnrolled =
                enrollmentRepository
                .existsByStudent_IdAndCourse_Id(
                    student.getId(),
                    course.getId()
                );

        if (alreadyEnrolled) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You are already enrolled in this course");
        }

        Enrollment enrollment =
                new Enrollment(student, course);

        Enrollment saved =
                enrollmentRepository.save(enrollment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Successfully enrolled in " + course.getTitle());
    }

    // Get all courses enrolled by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentEnrollments(
            @PathVariable Long studentId) {

        AppUser student = userRepository
                .findById(studentId)
                .orElse(null);

        if (student == null ||
            !"STUDENT".equals(student.getRole())) {

            return ResponseEntity.badRequest()
                    .body("Invalid student account");
        }

        List<EnrollmentResponse> response =
                enrollmentRepository
                .findAllByStudent_Id(studentId)
                .stream()
                .map(enrollment -> {

                    Course course = enrollment.getCourse();

                    return new EnrollmentResponse(
                        enrollment.getId(),
                        course.getId(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getInstructor(),
                        course.getDuration(),
                        enrollment.getEnrolledAt()
                    );
                })
                .toList();

        return ResponseEntity.ok(response);
    }
}
