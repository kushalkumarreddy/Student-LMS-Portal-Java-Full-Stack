
package com.edutrack.lms.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByEmail("admin@edutrack.com")) {

                AppUser admin = new AppUser();

                admin.setEmail("admin@edutrack.com");
                admin.setPassword(
                    passwordEncoder.encode("Admin@123")
                );
                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println("Default Admin Created!");
            }
        };
    }
}
