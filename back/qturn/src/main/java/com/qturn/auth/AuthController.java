package com.qturn.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qturn.models.UserModel;
import com.qturn.repositories.IUserRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private IUserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel user) {
        try {
            boolean isAuthenticated = authService.authenticate(user.getEmail(), user.getPassword());

            if (isAuthenticated) {
                UserModel authenticatedUser = userRepository.findByEmail(user.getEmail());

                Map<String, Object> response = new HashMap<>();
                response.put("userId", authenticatedUser.getId());
                response.put("email", authenticatedUser.getEmail());
                response.put("name", authenticatedUser.getName());
                response.put("surname", authenticatedUser.getSurname());
                response.put("coverage", authenticatedUser.getCoverage());
                response.put("dob", authenticatedUser.getDob());
                response.put("role", authenticatedUser.getRole().getRoleName());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (AuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
