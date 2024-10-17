package com.qturn.models;

import java.sql.Date;

import com.qturn.enums.Role;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "users")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    @Size(max = 100)
    private String name;

    @Column(name = "surname", nullable = false)
    @Size(max=100)
    private String surname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @Size(max = 100)
    private String password;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(nullable = true)
    @Size(max = 100)
    private String coverage;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dob; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
 
}
