package com.pictofold.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pictofold.backend.dto.LoginRequest;
import com.pictofold.backend.dto.ResendOtpRequest;
import com.pictofold.backend.dto.SignupRequest;
import com.pictofold.backend.dto.VerifyOtpRequest;
import com.pictofold.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        String result = authService.signup(request);
        if ("OTP sent to your email".equals(result)) {
            return ResponseEntity.ok(Map.of("success", true, "message", result));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        com.pictofold.backend.dto.AuthResponse response = authService.login(request);
        if ("Login successful!".equals(response.getMessage())) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String result = authService.verifyOtp(request);
        if ("Email verified successfully".equals(result)) {
            return ResponseEntity.ok(Map.of("success", true, "message", result));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody ResendOtpRequest request) {
        String result = authService.resendOtp(request);
        if ("OTP resent successfully".equals(result)) {
            return ResponseEntity.ok(Map.of("success", true, "message", result));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", result));
        }
    }
}
