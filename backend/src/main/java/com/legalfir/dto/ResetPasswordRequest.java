package com.legalfir.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String contact;
    private String newPassword;
}
