package com.kazihub.apk.controller;

import com.kazihub.apk.dto.ChatMessage;
import com.kazihub.apk.model.Message;
import com.kazihub.apk.model.User;
import com.kazihub.apk.repository.MessageRepository;
import com.kazihub.apk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        User sender = userRepository.findById(chatMessage.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(chatMessage.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(chatMessage.getContent())
                .build();

        Message savedMsg = messageRepository.save(message);

        // Send message to the specific user's queue
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getReceiverId()),"/queue/messages",
                savedMsg
        );
    }

    @GetMapping("/api/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return ResponseEntity.ok(messageRepository
                .findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(senderId, receiverId, senderId, receiverId));
    }
}
