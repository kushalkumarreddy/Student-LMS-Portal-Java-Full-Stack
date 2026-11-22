
package com.edutrack.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.entity.Course;
import com.edutrack.lms.repository.CourseRepository;
import com.edutrack.lms.repository.EnrollmentRepository;
import com.edutrack.lms.repository.LessonRepository;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseController(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // Get all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get single course by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a new course
    @PostMapping
    public ResponseEntity<?> addCourse(@RequestBody Course course) {

        if (course.getTitle() == null ||
            course.getTitle().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Course title is required");
        }

        Course savedCourse = courseRepository.save(course);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedCourse);
    }

    // Update an existing course
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestBody Course updatedCourse) {

        return courseRepository.findById(id)
                .map(course -> {

                    if (updatedCourse.getTitle() == null ||
                        updatedCourse.getTitle().isBlank()) {
                        return ResponseEntity.badRequest()
                                .body("Course title is required");
                    }

                    course.setTitle(updatedCourse.getTitle());
                    course.setDescription(updatedCourse.getDescription());
                    course.setInstructor(updatedCourse.getInstructor());
                    course.setDuration(updatedCourse.getDuration());

                    Course savedCourse = courseRepository.save(course);

                    return ResponseEntity.ok(savedCourse);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a course
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {

        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        lessonRepository.deleteAllByCourse_Id(id);
        enrollmentRepository.deleteAllByCourse_Id(id);
        courseRepository.deleteById(id);

        return ResponseEntity.ok("Course deleted successfully");
    }
}
