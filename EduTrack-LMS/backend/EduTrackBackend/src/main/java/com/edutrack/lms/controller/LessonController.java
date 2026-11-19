
package com.edutrack.lms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.LessonRequest;
import com.edutrack.lms.dto.LessonResponse;
import com.edutrack.lms.entity.Course;
import com.edutrack.lms.entity.Lesson;
import com.edutrack.lms.repository.CourseRepository;
import com.edutrack.lms.repository.LessonRepository;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "http://localhost:5173")
public class LessonController {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public LessonController(
            LessonRepository lessonRepository,
            CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    // ADD LESSON
    @PostMapping
    public ResponseEntity<?> addLesson(@RequestBody LessonRequest request) {

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Lesson title is required");
        }

        if (request.getCourseId() == null) {
            return ResponseEntity.badRequest()
                    .body("Course ID is required");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElse(null);

        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found");
        }

        Integer order = request.getLessonOrder();

        if (order == null || order < 1) {
            order = lessonRepository
                    .findAllByCourse_IdOrderByLessonOrderAsc(course.getId())
                    .size() + 1;
        }

        Lesson lesson = new Lesson(
                request.getTitle().trim(),
                request.getContent(),
                order,
                course
        );

        Lesson saved = lessonRepository.save(lesson);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    // GET LESSONS BY COURSE
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonResponse>> getLessonsByCourse(
            @PathVariable Long courseId) {

        List<LessonResponse> lessons = lessonRepository
                .findAllByCourse_IdOrderByLessonOrderAsc(courseId)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(lessons);
    }

    // GET SINGLE LESSON
    @GetMapping("/{id}")
    public ResponseEntity<?> getLesson(@PathVariable Long id) {

        Lesson lesson = lessonRepository.findById(id).orElse(null);

        if (lesson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Lesson not found");
        }

        return ResponseEntity.ok(toResponse(lesson));
    }

    // UPDATE LESSON
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLesson(
            @PathVariable Long id,
            @RequestBody LessonRequest request) {

        Lesson lesson = lessonRepository.findById(id).orElse(null);

        if (lesson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Lesson not found");
        }

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Lesson title is required");
        }

        lesson.setTitle(request.getTitle().trim());
        lesson.setContent(request.getContent());

        if (request.getLessonOrder() != null &&
                request.getLessonOrder() > 0) {
            lesson.setLessonOrder(request.getLessonOrder());
        }

        if (request.getCourseId() != null) {
            Course course = courseRepository
                    .findById(request.getCourseId())
                    .orElse(null);

            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Course not found");
            }

            lesson.setCourse(course);
        }

        Lesson updated = lessonRepository.save(lesson);

        return ResponseEntity.ok(toResponse(updated));
    }

    // DELETE LESSON
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {

        if (!lessonRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Lesson not found");
        }

        lessonRepository.deleteById(id);

        return ResponseEntity.ok("Lesson deleted successfully");
    }

    private LessonResponse toResponse(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getLessonOrder(),
                lesson.getCourse().getId()
        );
    }
}
