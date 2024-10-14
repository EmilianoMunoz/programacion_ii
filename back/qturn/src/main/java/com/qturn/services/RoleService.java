package com.qturn.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qturn.models.RoleModel;
import com.qturn.repositories.IRoleRepository;

@Service
public class RoleService {

    @Autowired
    private IRoleRepository roleRepository;

    public RoleModel getRoleById(Long id) {
        Optional<RoleModel> role = roleRepository.findById(id);
        if (role.isPresent()) {
            return role.get();
        } else {
            throw new RuntimeException("Role not found");
        }
    }

    public List<RoleModel> getAllRoles() {
        return roleRepository.findAll();
    }

    public RoleModel saveRole(RoleModel role) {
        return roleRepository.save(role);
    }

    public RoleModel updateRole(RoleModel request, Long id) {
        Optional<RoleModel> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            RoleModel role = optionalRole.get();
            role.setRoleName(request.getRoleName());
            return roleRepository.save(role);
        } else {
            throw new RuntimeException("Role not found");
        }
    }

    public Boolean deleteRole(Long id) {
        Optional<RoleModel> optionalRole = roleRepository.findById(id);
        if (optionalRole.isPresent()) {
            roleRepository.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("Role not found");
        }
    }
}
