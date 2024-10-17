package com.qturn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qturn.models.UserModel;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<UserModel, Long> {

    Optional<UserModel> findByEmail(String email);
}