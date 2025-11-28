package com.pictofold.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pictofold.backend.dto.AuthResponse;
import com.pictofold.backend.dto.LoginRequest;
import com.pictofold.backend.dto.ResendOtpRequest;
import com.pictofold.backend.dto.SignupRequest;
import com.pictofold.backend.dto.VerifyOtpRequest;
import com.pictofold.backend.model.User;
import com.pictofold.backend.repository.UserRepository;
import com.pictofold.backend.security.JwtUtils;

import lombok.RequiredArgsConstructor;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;

    private static final int OTP_EXPIRATION_MINUTES = 10;
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_RESENDS_PER_HOUR = 5;

    // ------------------ SIGNUP ------------------
    public String signup(SignupRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        String username = request.getUsername().trim();

        // Validate input
        if (username.isEmpty()) return "Username cannot be empty!";
        if (request.getPassword().isEmpty()) return "Password cannot be empty!";

        // Email already exists
        if (userRepository.existsByEmail(email)) {
            return "Email already registered!";
        }

        // Hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Generate OTP
        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);

        // Build the user object
        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(hashedPassword)
                .emailVerified(false)
                .role("USER")
                .otpHash(otpHash)
                .otpExpiresAt(Instant.now().plus(OTP_EXPIRATION_MINUTES, ChronoUnit.MINUTES))
                .otpAttempts(0)
                .lastOtpSentAt(Instant.now())
                .build();

        userRepository.save(user);

        // Send OTP Email
        emailService.sendOtpEmail(email, otp);

        return "OTP sent to your email";
    }

    // ------------------ LOGIN ------------------
    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return AuthResponse.builder()
                    .message("User not found!")
                    .build();
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return AuthResponse.builder()
                    .message("Incorrect password!")
                    .build();
        }
        if (!user.isEmailVerified()) {
            return AuthResponse.builder()
                    .message("Please verify your email first")
                    .build();
        }

        // UPDATE last login time
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        // Generate Token
        String token = jwtUtils.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .message("Login successful!")
                .build();
    }

    // ------------------ VERIFY OTP ------------------
    public String verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) return "User not found!";

        if (user.isEmailVerified()) return "Email already verified!";

        if (user.getOtpExpiresAt().isBefore(Instant.now())) {
            return "OTP expired!";
        }

        if (user.getOtpAttempts() >= MAX_OTP_ATTEMPTS) {
            return "Too many failed attempts. Please request a new OTP.";
        }

        if (!passwordEncoder.matches(request.getOtp(), user.getOtpHash())) {
            user.setOtpAttempts(user.getOtpAttempts() + 1);
            userRepository.save(user);
            return "Invalid OTP!";
        }

        // Success
        user.setEmailVerified(true);
        user.setOtpHash(null);
        user.setOtpExpiresAt(null);
        user.setOtpAttempts(0);
        userRepository.save(user);

        return "Email verified successfully";
    }

    // ------------------ RESEND OTP ------------------
    public String resendOtp(ResendOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) return "User not found!";
        if (user.isEmailVerified()) return "Email already verified!";

        // Rate Limiting
        if (user.getLastOtpSentAt() != null &&
            user.getLastOtpSentAt().plus(RESEND_COOLDOWN_SECONDS, ChronoUnit.SECONDS).isAfter(Instant.now())) {
            return "Please wait before resending OTP.";
        }

        // Generate new OTP
        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);

        user.setOtpHash(otpHash);
        user.setOtpExpiresAt(Instant.now().plus(OTP_EXPIRATION_MINUTES, ChronoUnit.MINUTES));
        user.setOtpAttempts(0);
        user.setLastOtpSentAt(Instant.now());

        userRepository.save(user);

        // Send OTP Email
        emailService.sendOtpEmail(email, otp);

        return "OTP resent successfully";
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
