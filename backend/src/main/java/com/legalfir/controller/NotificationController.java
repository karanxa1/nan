package com.legalfir.controller;

import com.legalfir.dto.NotificationDto;
import com.legalfir.entity.User;
import com.legalfir.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public ResponseEntity<List<NotificationDto>> getMyNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getMyNotifications(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> send(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String message = body.get("message").toString();
        notificationService.adminSend(userId, message);
        return ResponseEntity.ok(Map.of("status", "sent"));
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> broadcast(@RequestBody Map<String, String> body) {
        notificationService.broadcast(body.get("message"));
        return ResponseEntity.ok(Map.of("status", "broadcast sent"));
    }
}
