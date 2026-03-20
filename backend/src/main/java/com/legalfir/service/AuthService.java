package com.legalfir.service;

import com.legalfir.dto.LoginRequest;
import com.legalfir.dto.LoginResponse;
import com.legalfir.dto.RegisterRequest;
import com.legalfir.entity.User;

public interface AuthService {
    User register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void resetPassword(com.legalfir.dto.ResetPasswordRequest request);
}
