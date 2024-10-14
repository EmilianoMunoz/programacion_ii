package com.qturn.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.qturn.models.UserModel;
import com.qturn.models.RoleModel;
import com.qturn.repositories.IUserRepository;

@Service
public class UserService {

    @Autowired
    IUserRepository userRepository;

    @Autowired
    private RoleService roleService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Page<UserModel> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public UserModel create(UserModel user) {
        RoleModel role = roleService.getRoleById(user.getRole().getId());
        user.setRole(role);
    
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
    
        if (role.getId() == 3 && user.getDob() == null) {
            throw new IllegalArgumentException("Patients must have a birthdate.");
        }
    
        return userRepository.save(user);
    }

    public Optional<UserModel> findById(Long id) {
        return userRepository.findById(id);
    }

    public UserModel update(UserModel request, Long id) {
        Optional<UserModel> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserModel user = optionalUser.get();
    
            user.setName(request.getName());
            user.setSurname(request.getSurname());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
    
            if (request.getCoverage() != null) {
                user.setCoverage(request.getCoverage());
            }
    

            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public Boolean delete(Long id) {
        Optional<UserModel> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            userRepository.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
