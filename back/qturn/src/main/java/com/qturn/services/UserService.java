package com.qturn.services;

import com.qturn.dto.CredentialsDto;
import com.qturn.dto.SignUpDto;
import com.qturn.dto.UserUpdateDto;
import com.qturn.dto.UserDto;
import com.qturn.enums.Role;
import com.qturn.models.UserModel;
import com.qturn.exceptions.AppException;
import com.qturn.mappers.UserMapper;
import com.qturn.repositories.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.CharBuffer;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // Método para autenticar por email y contraseña
    public UserDto email(CredentialsDto credentialsDto) {
        UserModel user = userRepository.findByEmail(credentialsDto.email())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    // Método para registrar un nuevo usuario
    public UserDto register(SignUpDto userDto) {
        Optional<UserModel> optionalUser = userRepository.findByEmail(userDto.email());

        if (optionalUser.isPresent()) {
            throw new AppException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        UserModel user = userMapper.signUpToUser(userDto);
        user.setRole(Role.PATIENT);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.password())));

        UserModel savedUser = userRepository.save(user);

        return userMapper.toUserDto(savedUser);
    }

    // Método para encontrar usuario por email
    public UserDto findByEmail(String email) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    // Nuevo método para obtener datos del usuario por su ID
    public UserDto getUserById(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        return userMapper.toUserDto(user);
    }

    // Nuevo método para obtener todos los usuarios
    public List<UserDto> getAllUsers() {
        List<UserModel> userModels = userRepository.findAll(); // Obtiene todos los usuarios
        return userModels.stream().map(userMapper::toUserDto).collect(Collectors.toList()); // Convierte a UserDto
    }

    // Método para actualizar un usuario existente
    @Transactional
    public UserDto updateUser(Long id, UserUpdateDto updateUserDto) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // Actualiza los campos del usuario según el DTO
        user.setName(updateUserDto.getName());
        user.setSurname(updateUserDto.getSurname());
        user.setEmail(updateUserDto.getEmail());
        user.setPhone(updateUserDto.getPhone());
        user.setCoverage(updateUserDto.getCoverage());


        UserModel updatedUser = userRepository.save(user);
        return userMapper.toUserDto(updatedUser);
    }

    // Método para eliminar un usuario por su ID
    @Transactional
    public void deleteUser(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        userRepository.delete(user); // Elimina el usuario
    }
}
