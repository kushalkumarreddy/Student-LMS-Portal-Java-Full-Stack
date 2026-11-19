
package com.edutrack.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.entity.Course;
import com.edutrack.lms.repository.CourseRepository;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Get all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
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
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {

        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        courseRepository.deleteById(id);

        return ResponseEntity.ok("Course deleted successfully");
    }
}
