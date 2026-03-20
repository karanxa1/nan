package com.legalfir.service.impl;

import com.legalfir.dto.NotificationDto;
import com.legalfir.entity.Notification;
import com.legalfir.entity.User;
import com.legalfir.repository.NotificationRepository;
import com.legalfir.repository.UserRepository;
import com.legalfir.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void send(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public NotificationDto markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        return toDto(notificationRepository.save(n));
    }

    @Override
    public void adminSend(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        send(user, message);
    }

    @Override
    public void broadcast(String message) {
        userRepository.findAll().forEach(user -> send(user, message));
    }

    private NotificationDto toDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setUserId(n.getUser().getId());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
