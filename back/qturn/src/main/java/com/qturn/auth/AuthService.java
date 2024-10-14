package com.qturn.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.qturn.models.UserModel;
import com.qturn.repositories.IUserRepository;

@Service
public class AuthService {

    @Autowired
    private IUserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean authenticate(String email, String password) {
        UserModel user = userRepository.findByEmail(email);
        if (user == null) {
            throw new AuthException("Email not found");
        }

        // Comparar la contraseña hasheada con la contraseña proporcionada
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthException("Invalid password");
        }

        return true; // Retornar true si la autenticación es exitosa
    }
}
