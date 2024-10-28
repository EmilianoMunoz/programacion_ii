package com.qturn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.qturn.models.ScheduleModel;
import java.util.List;
import java.util.Optional;

@Repository
public interface IScheduleRepository extends JpaRepository<ScheduleModel, Long> {
    
    // Obtiene todos los horarios de un doctor específico
    List<ScheduleModel> findByDoctorId(Long doctorId);
    
    // Obtiene los horarios de un doctor en un día específico
    List<ScheduleModel> findByDoctorIdAndDayOfWeek(Long doctorId, Integer dayOfWeek);
    
    // Obtiene solo los horarios activos de un doctor
    List<ScheduleModel> findByDoctorIdAndIsActiveTrue(Long doctorId);

    // Verifica si existen horarios asociados a un doctor
    boolean existsByDoctorId(Long doctorId);

    // Obtiene un horario específico por ID, incluyendo solo si está activo
    Optional<ScheduleModel> findByScheduleIdAndIsActiveTrue(Long scheduleId);
    
    // Cuenta el número de horarios activos para un doctor específico (opcional)
    long countByDoctorIdAndIsActiveTrue(Long doctorId);

    List<ScheduleModel> findByDoctorIdAndIsActive(Long doctorId, Boolean isActive);

}
