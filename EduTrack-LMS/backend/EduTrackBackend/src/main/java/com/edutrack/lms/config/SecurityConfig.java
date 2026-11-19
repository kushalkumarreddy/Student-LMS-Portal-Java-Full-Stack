
package com.edutrack.lms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;

    public SecurityConfig(AuthTokenFilter authTokenFilter) {
        this.authTokenFilter = authTokenFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"Unauthorized. Please sign in.\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("{\"message\":\"Access denied. Insufficient permissions.\"}");
                })
            )
            .authorizeHttpRequests(auth -> auth

                // Pre-flight CORS options
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Login and registration
                .requestMatchers("/api/auth/**").permitAll()

                // Course access
                .requestMatchers(HttpMethod.GET,
                    "/api/courses",
                    "/api/courses/**"
                ).hasAnyRole("ADMIN", "STUDENT")

                .requestMatchers(HttpMethod.POST,
                    "/api/courses"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT,
                    "/api/courses/**"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE,
                    "/api/courses/**"
                ).hasRole("ADMIN")

                // Lesson access
                .requestMatchers(HttpMethod.GET,
                    "/api/lessons",
                    "/api/lessons/**"
                ).hasAnyRole("ADMIN", "STUDENT")

                .requestMatchers(HttpMethod.POST,
                    "/api/lessons"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT,
                    "/api/lessons/**"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE,
                    "/api/lessons/**"
                ).hasRole("ADMIN")

                // Student management
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Enrollments
                .requestMatchers(HttpMethod.POST,
                    "/api/enrollments"
                ).hasRole("STUDENT")

                .requestMatchers(HttpMethod.GET,
                    "/api/enrollments/**"
                ).hasAnyRole("ADMIN", "STUDENT")

                // All remaining API endpoints require authentication
                .anyRequest().authenticated()
            );

        http.addFilterBefore(
            authTokenFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException("Token based authentication is used");
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
            List.of("http://localhost:[*]", "http://127.0.0.1:[*]")
        );

        configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
