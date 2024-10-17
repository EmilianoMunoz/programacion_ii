package com.qturn.mappers;

import com.qturn.dto.SignUpDto;
import com.qturn.dto.UserDto;
import com.qturn.models.UserModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(UserModel user);

    @Mapping(target = "password", ignore = true)
    UserModel signUpToUser(SignUpDto signUpDto);

}