package com.qturn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qturn.models.RoleModel;

@Repository

public interface IRoleRepository extends JpaRepository<RoleModel, Long> {

}
