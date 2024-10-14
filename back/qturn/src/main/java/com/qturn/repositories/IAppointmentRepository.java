package com.qturn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.qturn.models.AppointmentModel;

@Repository

public interface IAppointmentRepository extends JpaRepository<AppointmentModel, Long> {

}
