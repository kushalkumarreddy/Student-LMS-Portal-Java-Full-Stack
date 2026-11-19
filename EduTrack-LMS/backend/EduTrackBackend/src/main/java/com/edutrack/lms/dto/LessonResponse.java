
package com.edutrack.lms.dto;

public class LessonResponse {

    private Long id;
    private String title;
    private String content;
    private Integer lessonOrder;
    private Long courseId;

    public LessonResponse(Long id, String title, String content,
                          Integer lessonOrder, Long courseId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.lessonOrder = lessonOrder;
        this.courseId = courseId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public Long getCourseId() {
        return courseId;
    }
}
