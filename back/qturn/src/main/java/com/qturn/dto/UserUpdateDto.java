package com.qturn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateDto {

    private String name;
    private String surname;
    private String email;
    private String phone;
    private String dob;
    private String coverage;

}