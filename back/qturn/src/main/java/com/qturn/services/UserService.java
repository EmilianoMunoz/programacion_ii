package com.qturn.services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.qturn.models.UserModel;
import com.qturn.repositories.IUserRepository;

@Service
public class UserService {

    @Autowired
    IUserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Page<UserModel> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public UserModel saveUser(UserModel user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        
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
            user.setCoverage(request.getCoverage());
            user.setRole(request.getRole());

            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                String hashedPassword = passwordEncoder.encode(request.getPassword());
                user.setPassword(hashedPassword);
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
