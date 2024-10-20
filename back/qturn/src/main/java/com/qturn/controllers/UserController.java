package com.qturn.controllers;

import com.qturn.dto.MessageDto;
import com.qturn.dto.UserUpdateDto; // Importa el nuevo DTO
import com.qturn.dto.UserDto;
import com.qturn.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/patient")
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<MessageDto> patient() {
        return ResponseEntity.ok(new MessageDto("patient"));
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasAnyAuthority('DOCTOR', 'ADMIN')")
    public ResponseEntity<MessageDto> doctor() {
        return ResponseEntity.ok(new MessageDto("doctor"));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MessageDto> admin() {
        return ResponseEntity.ok(new MessageDto("admin"));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Método para actualizar un usuario
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')") // Solo ADMIN y DOCTOR pueden actualizar
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserUpdateDto updateUserDto) {
        UserDto updatedUser = userService.updateUser(id, updateUserDto);
        return ResponseEntity.ok(updatedUser);
    }

    // Método para eliminar un usuario
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')") // Solo ADMIN puede eliminar
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Devuelve 204 No Content
    }
}
