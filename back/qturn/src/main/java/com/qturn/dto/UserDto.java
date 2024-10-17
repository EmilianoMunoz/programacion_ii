package com.qturn.dto;

import com.qturn.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserDto {

    private Long id;
    private String name;
    private String surname;
    private String email;
    private String token;
    private Role role;

}