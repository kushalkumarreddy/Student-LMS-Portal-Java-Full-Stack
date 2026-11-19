
package com.edutrack.lms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutrack.lms.entity.AuthSession;

@Repository
public interface AuthSessionRepository
        extends JpaRepository<AuthSession, Long> {

    Optional<AuthSession> findByToken(String token);

    void deleteByToken(String token);

    void deleteAllByUserId(Long userId);

    List<AuthSession> findAllByUserId(Long userId);
}
