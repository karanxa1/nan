package com.legalfir.service;

import com.legalfir.entity.Notification;
import com.legalfir.entity.User;
import com.legalfir.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    void send(User user, String message);
    List<NotificationDto> getMyNotifications(User user);
    NotificationDto markRead(Long id);
    void adminSend(Long userId, String message);
    void broadcast(String message);
}

