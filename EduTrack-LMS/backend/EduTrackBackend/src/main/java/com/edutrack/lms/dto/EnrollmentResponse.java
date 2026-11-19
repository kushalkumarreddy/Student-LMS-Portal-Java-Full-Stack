
package com.edutrack.lms.dto;

import java.time.LocalDateTime;

public class EnrollmentResponse {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String instructor;
    private String duration;
    private LocalDateTime enrolledAt;

    public EnrollmentResponse(
            Long id,
            Long courseId,
            String title,
            String description,
            String instructor,
            String duration,
            LocalDateTime enrolledAt) {

        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.duration = duration;
        this.enrolledAt = enrolledAt;
    }

    public Long getId() {
        return id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getInstructor() {
        return instructor;
    }

    public String getDuration() {
        return duration;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
}
