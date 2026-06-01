package com.kazihub.apk.controller;

import com.kazihub.apk.model.User;
import com.kazihub.apk.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users/{userId}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.toggleUserStatus(userId));
    }
}
