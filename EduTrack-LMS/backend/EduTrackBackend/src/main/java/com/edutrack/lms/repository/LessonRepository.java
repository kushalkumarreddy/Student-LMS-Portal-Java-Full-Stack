
package com.edutrack.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutrack.lms.entity.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findAllByCourse_IdOrderByLessonOrderAsc(Long courseId);

    void deleteAllByCourse_Id(Long courseId);

}
