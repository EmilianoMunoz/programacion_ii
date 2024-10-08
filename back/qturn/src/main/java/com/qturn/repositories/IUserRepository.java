package com.qturn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qturn.models.UserModel;

@Repository

public interface IUserRepository extends JpaRepository<UserModel, Long> {

}
