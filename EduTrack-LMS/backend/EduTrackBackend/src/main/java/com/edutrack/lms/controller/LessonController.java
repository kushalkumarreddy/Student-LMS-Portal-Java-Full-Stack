
package com.edutrack.lms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.edutrack.lms.dto.LessonRequest;
import com.edutrack.lms.dto.LessonResponse;
import com.edutrack.lms.entity.Course;
import com.edutrack.lms.entity.Lesson;
import com.edutrack.lms.repository.CourseRepository;
import com.edutrack.lms.repository.EnrollmentRepository;
import com.edutrack.lms.repository.LessonRepository;
import com.edutrack.lms.service.AuthTokenService.TokenData;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class LessonController {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public LessonController(
        LessonRepository lessonRepository,
        CourseRepository courseRepository,
        EnrollmentRepository enrollmentRepository
    ) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    @PostMapping
    public ResponseEntity<?> createLesson(
        @RequestBody LessonRequest request
    ) {
        if (request.getTitle() == null ||
            request.getTitle().isBlank() ||
            request.getCourseId() == null) {

            return ResponseEntity.badRequest()
                .body(Map.of("message", "Lesson title and course are required."));
        }

        Course course = courseRepository.findById(request.getCourseId())
            .orElse(null);

        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Course not found."));
        }

        List<Lesson> existingLessons =
            lessonRepository.findAllByCourse_IdOrderByLessonOrderAsc(
                course.getId()
            );

        Integer order = request.getLessonOrder();

        if (order == null || order < 1) {
            order = existingLessons.size() + 1;
        }

        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle().trim());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(order);
        lesson.setCourse(course);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(toResponse(lessonRepository.save(lesson)));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getLessonsByCourse(
        @PathVariable Long courseId,
        Authentication authentication
    ) {
        TokenData user = getCurrentUser(authentication);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Please sign in."));
        }

        if ("STUDENT".equals(user.role()) &&
            !enrollmentRepository.existsByStudent_IdAndCourse_Id(
                user.id(),
                courseId
            )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Enroll in this course to access its lessons."));
        }

        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Course not found."));
        }

        List<LessonResponse> lessons =
            lessonRepository.findAllByCourse_IdOrderByLessonOrderAsc(courseId)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonById(
        @PathVariable Long id,
        Authentication authentication
    ) {
        TokenData user = getCurrentUser(authentication);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Please sign in."));
        }

        Lesson lesson = lessonRepository.findById(id).orElse(null);

        if (lesson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Lesson not found."));
        }

        Long courseId = lesson.getCourse().getId();

        if ("STUDENT".equals(user.role()) &&
            !enrollmentRepository.existsByStudent_IdAndCourse_Id(
                user.id(),
                courseId
            )) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "You are not enrolled in this course."));
        }

        return ResponseEntity.ok(toResponse(lesson));
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLesson(
        @PathVariable Long id,
        @RequestBody LessonRequest request
    ) {
        Lesson lesson = lessonRepository.findById(id).orElse(null);

        if (lesson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Lesson not found."));
        }

        if (request.getTitle() == null ||
            request.getTitle().isBlank()) {

            return ResponseEntity.badRequest()
                .body(Map.of("message", "Lesson title is required."));
        }

        lesson.setTitle(request.getTitle().trim());
        lesson.setContent(request.getContent());

        if (request.getLessonOrder() != null &&
            request.getLessonOrder() > 0) {
            lesson.setLessonOrder(request.getLessonOrder());
        }

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                .orElse(null);

            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Course not found."));
            }

            lesson.setCourse(course);
        }

        return ResponseEntity.ok(
            toResponse(lessonRepository.save(lesson))
        );
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        if (!lessonRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Lesson not found."));
        }

        lessonRepository.deleteById(id);

        return ResponseEntity.ok(
            Map.of("message", "Lesson deleted successfully.")
        );
    }

    private TokenData getCurrentUser(Authentication authentication) {
        if (authentication == null ||
            !(authentication.getPrincipal() instanceof TokenData)) {
            return null;
        }

        return (TokenData) authentication.getPrincipal();
    }

    private LessonResponse toResponse(Lesson lesson) {
        LessonResponse response = new LessonResponse();

        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setContent(lesson.getContent());
        response.setLessonOrder(lesson.getLessonOrder());
        response.setCourseId(lesson.getCourse().getId());

        return response;
    }
}
