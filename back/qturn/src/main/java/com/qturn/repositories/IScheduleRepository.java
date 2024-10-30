package com.qturn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.qturn.models.ScheduleModel;
import java.util.List;
import java.util.Optional;

@Repository
public interface IScheduleRepository extends JpaRepository<ScheduleModel, Long> {
    
    List<ScheduleModel> findByDoctorId(Long doctorId);
    
    List<ScheduleModel> findByDoctorIdAndDayOfWeek(Long doctorId, Integer dayOfWeek);
    
    List<ScheduleModel> findByDoctorIdAndIsActiveTrue(Long doctorId);

    boolean existsByDoctorId(Long doctorId);

    Optional<ScheduleModel> findByScheduleIdAndIsActiveTrue(Long scheduleId);
    
    long countByDoctorIdAndIsActiveTrue(Long doctorId);

    List<ScheduleModel> findByDoctorIdAndIsActive(Long doctorId, Boolean isActive);

}
