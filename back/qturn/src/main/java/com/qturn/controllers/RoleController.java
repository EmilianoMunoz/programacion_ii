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

import com.qturn.models.RoleModel;
import com.qturn.services.RoleService;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping(path = "/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        try {
            RoleModel role = roleService.getRoleById(id);
            return ResponseEntity.ok(role);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<RoleModel>> getAllRoles() {
        List<RoleModel> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @PostMapping
    public ResponseEntity<RoleModel> saveRole(@RequestBody RoleModel role) {
        RoleModel newRole = roleService.saveRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRole);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<?> updateRole(@RequestBody RoleModel request, @PathVariable("id") Long id) {
        try {
            RoleModel updatedRole = roleService.updateRole(request, id);
            return ResponseEntity.ok(updatedRole);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deleteRole(@PathVariable("id") Long id) {
        try {
            boolean isDeleted = roleService.deleteRole(id);
            if (isDeleted) {
                return ResponseEntity.ok("Role deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
