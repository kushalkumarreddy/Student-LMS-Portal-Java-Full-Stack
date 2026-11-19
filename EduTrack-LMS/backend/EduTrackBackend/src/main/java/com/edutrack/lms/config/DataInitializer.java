
package com.edutrack.lms.config;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.entity.Course;
import com.edutrack.lms.entity.Lesson;
import com.edutrack.lms.repository.CourseRepository;
import com.edutrack.lms.repository.LessonRepository;
import com.edutrack.lms.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(
            UserRepository userRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            String adminEmail = "admin@edutrack.com";
            Optional<AppUser> adminOpt = userRepository.findByEmail(adminEmail);

            if (adminOpt.isEmpty()) {
                AppUser admin = new AppUser();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Default Admin Created (admin@edutrack.com / Admin@123)!");
            } else {
                AppUser admin = adminOpt.get();
                if (!passwordEncoder.matches("Admin@123", admin.getPassword())) {
                    admin.setPassword(passwordEncoder.encode("Admin@123"));
                    admin.setRole("ADMIN");
                    userRepository.save(admin);
                    System.out.println("Admin password updated to encoded Admin@123!");
                }
            }

            if (courseRepository.count() == 0) {
                Course course1 = new Course(
                    "Full-Stack Java & Spring Boot",
                    "Master modern backend development with Java 21, Spring Boot, Spring Security, JPA, and RESTful API architecture.",
                    "Dr. Alex Johnson",
                    "8 Weeks"
                );
                Course savedCourse1 = courseRepository.save(course1);

                lessonRepository.save(new Lesson(
                    "Introduction to Spring Boot & Architecture",
                    "Welcome to Full-Stack Java Development! In this lesson, we cover Spring Boot fundamentals, dependency injection, and project structuring best practices.",
                    1,
                    savedCourse1
                ));

                lessonRepository.save(new Lesson(
                    "Spring Data JPA & Entity Relationships",
                    "Learn how to manage persistence, configure entity mappings (@Entity, @Table, @ManyToOne), build Spring Data repositories, and optimize queries.",
                    2,
                    savedCourse1
                ));

                lessonRepository.save(new Lesson(
                    "Securing APIs with Spring Security & Token Auth",
                    "Explore token-based authentication, request filters (OncePerRequestFilter), password hashing with BCrypt, and role-based endpoint access control.",
                    3,
                    savedCourse1
                ));

                Course course2 = new Course(
                    "Modern React & Frontend Development",
                    "Build dynamic, high-performance web applications using React, Bootstrap, Vite, React Router, and Axios.",
                    "Sarah Miller",
                    "6 Weeks"
                );
                Course savedCourse2 = courseRepository.save(course2);

                lessonRepository.save(new Lesson(
                    "React Fundamentals: Components & State",
                    "Understand React's component-based paradigm, useState, useEffect hooks, and component lifecycle management.",
                    1,
                    savedCourse2
                ));

                lessonRepository.save(new Lesson(
                    "Client-Side Routing with React Router",
                    "Master declarative routing, nested routes, protected routes, and programmatical navigation using useNavigate and Navigate.",
                    2,
                    savedCourse2
                ));

                lessonRepository.save(new Lesson(
                    "Connecting Frontend to Backend with Axios",
                    "Learn how to configure Axios interceptors for automatic JWT/token attachment, error handling, and robust data fetching patterns.",
                    3,
                    savedCourse2
                ));

                System.out.println("Default LMS sample courses and lessons seeded successfully!");
            }
        };
    }
}
