
package com.edutrack.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.edutrack.lms.entity.Course;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

}
