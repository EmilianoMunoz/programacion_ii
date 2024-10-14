package com.qturn.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import com.qturn.models.UserModel;
import com.qturn.services.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public Page<UserModel> getUsers(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return this.userService.getUsers(pageable);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserModel user) {
        try {
            UserModel newUser = this.userService.create(user);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<UserModel> user = this.userService.findById(id);
        return user.isPresent() ? ResponseEntity.ok(user.get()) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<?> update(@RequestBody UserModel request, @PathVariable("id") Long id) {
        try {
            UserModel updatedUser = this.userService.update(request, id);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        boolean isDeleted = this.userService.delete(id);
        if (isDeleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}