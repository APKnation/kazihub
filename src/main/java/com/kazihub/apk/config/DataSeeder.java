package com.kazihub.apk.config;

import com.kazihub.apk.model.Role;
import com.kazihub.apk.model.User;
import com.kazihub.apk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByPhone("admin@kazihub.com")) {
            User admin = User.builder()
                    .name("Super Admin")
                    .phone("admin@kazihub.com") // using email as phone placeholder for admin
                    .email("admin@kazihub.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Default Admin user created. Login: admin@kazihub.com / admin123");
        }
    }
}
