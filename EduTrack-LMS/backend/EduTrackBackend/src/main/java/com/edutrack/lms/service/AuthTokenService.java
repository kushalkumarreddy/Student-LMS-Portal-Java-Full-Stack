
package com.edutrack.lms.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edutrack.lms.entity.AppUser;
import com.edutrack.lms.entity.AuthSession;
import com.edutrack.lms.repository.AuthSessionRepository;

@Service
public class AuthTokenService {

    private final AuthSessionRepository sessionRepository;

    public AuthTokenService(
            AuthSessionRepository sessionRepository) {

        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public String createToken(AppUser user) {

        String token = UUID.randomUUID().toString();

        AuthSession session = new AuthSession();

        session.setToken(token);
        session.setUserId(user.getId());
        session.setEmail(user.getEmail());
        session.setRole(user.getRole());
        session.setExpiresAt(
                LocalDateTime.now(ZoneOffset.UTC).plusHours(12)
        );

        sessionRepository.save(session);

        return token;
    }

    @Transactional
    public TokenData validateToken(String token) {

        Optional<AuthSession> optionalSession =
                sessionRepository.findByToken(token);

        if (optionalSession.isEmpty()) {
            return null;
        }

        AuthSession session = optionalSession.get();

        if (session.getExpiresAt().isBefore(
                LocalDateTime.now(ZoneOffset.UTC))) {

            sessionRepository.delete(session);
            return null;
        }

        return new TokenData(
                session.getUserId(),
                session.getEmail(),
                session.getRole(),
                session.getExpiresAt().toInstant(ZoneOffset.UTC)
        );
    }

    @Transactional
    public void removeToken(String token) {
        sessionRepository.findByToken(token).ifPresent(sessionRepository::delete);
    }

    @Transactional
    public void removeAllForUser(Long userId) {
        sessionRepository.deleteAllByUserId(userId);
    }

    public record TokenData(
            Long id,
            String email,
            String role,
            java.time.Instant expiresAt) {
    }
}
