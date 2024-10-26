package com.qturn.repositories;

import com.qturn.models.AppointmentModel;
import com.qturn.models.UserModel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IAppointmentRepository extends JpaRepository<AppointmentModel, Long> {
    
    List<AppointmentModel> findByDoctorAndTime(UserModel doctor, LocalDateTime time);
    
    List<AppointmentModel> findByTime(LocalDateTime time);
    
    List<AppointmentModel> findByTimeBetween(LocalDateTime start, LocalDateTime end);
    
    boolean existsByTime(LocalDateTime time);

    List<AppointmentModel> findByPatient_IdAndTimeAfter(Long patientId, LocalDateTime after);

    List<AppointmentModel> findByDoctor_IdAndTimeAfter(Long doctorId, LocalDateTime after);

    List<AppointmentModel> findByDoctor_IdAndTimeBetween(Long doctorId, LocalDateTime startOfDay, LocalDateTime endOfDay);

}