
package com.edutrack.lms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edutrack.lms.entity.Enrollment;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findAllByStudent_Id(Long studentId);

    boolean existsByStudent_IdAndCourse_Id(
        Long studentId,
        Long courseId
    );

}
