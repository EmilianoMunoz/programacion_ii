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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserDto email(CredentialsDto credentialsDto) {
        UserModel user = userRepository.findByEmail(credentialsDto.email())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

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

    public UserDto findByEmail(String email) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public UserDto getUserById(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        return userMapper.toUserDto(user);
    }

    public List<UserDto> getAllUsers() {
        List<UserModel> userModels = userRepository.findAll(); 
        return userModels.stream().map(userMapper::toUserDto).collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateUser(Long id, UserUpdateDto updateUserDto) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        user.setName(updateUserDto.getName());
        user.setSurname(updateUserDto.getSurname());
        user.setEmail(updateUserDto.getEmail());
        user.setPhone(updateUserDto.getPhone());
        user.setCoverage(updateUserDto.getCoverage());


        UserModel updatedUser = userRepository.save(user);
        return userMapper.toUserDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        userRepository.delete(user);
    }
}
