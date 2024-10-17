package com.qturn.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.qturn.dto.MessageDto;


@RestController
public class UserController {

    @GetMapping("/users/patinent")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<MessageDto> patient() {
        return ResponseEntity.ok(new MessageDto("patient"));
    }

    @GetMapping("/users/doctor")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<MessageDto> doctor() {
        return ResponseEntity.ok(new MessageDto("doctor"));
    }

    @GetMapping("/users/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MessageDto> admin() {
        return ResponseEntity.ok(new MessageDto("admin"));
    }

}