package com.qturn.services;

import com.qturn.dto.ScheduleDto;
import com.qturn.mappers.ScheduleMapper;
import com.qturn.models.ScheduleModel;
import com.qturn.repositories.IScheduleRepository;
import com.qturn.exceptions.AppException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final IScheduleRepository workScheduleRepository;
    private final ScheduleMapper workScheduleMapper;

    public ScheduleDto createSchedule(ScheduleDto workScheduleDTO) {
        validateNoDuplicateDay(workScheduleDTO.getDoctorId(), workScheduleDTO.getDayOfWeek(), null);
        validateDayOfWeek(workScheduleDTO.getDayOfWeek());
        validateTimeRange(workScheduleDTO.getStartTime(), workScheduleDTO.getEndTime());
        validateSlotDuration(workScheduleDTO.getSlotDuration(), workScheduleDTO.getStartTime(), workScheduleDTO.getEndTime());
        
        ScheduleModel workSchedule = workScheduleMapper.toEntity(workScheduleDTO);
        workSchedule.setIsActive(true);
    
        workSchedule = workScheduleRepository.save(workSchedule);
        return workScheduleMapper.toDTO(workSchedule);
    }

    public ScheduleDto updateSchedule(Long scheduleId, ScheduleDto workScheduleDTO) {
        workScheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con id: " + scheduleId));

        validateNoDuplicateDay(workScheduleDTO.getDoctorId(), workScheduleDTO.getDayOfWeek(), scheduleId);
        validateDayOfWeek(workScheduleDTO.getDayOfWeek());
        validateTimeRange(workScheduleDTO.getStartTime(), workScheduleDTO.getEndTime());
        validateSlotDuration(workScheduleDTO.getSlotDuration(), workScheduleDTO.getStartTime(), workScheduleDTO.getEndTime());

        ScheduleModel workSchedule = workScheduleMapper.toEntity(workScheduleDTO);
        workSchedule.setScheduleId(scheduleId);
        workSchedule = workScheduleRepository.save(workSchedule);
        return workScheduleMapper.toDTO(workSchedule);
    }

    public void deleteSchedule(Long scheduleId) {
        ScheduleModel schedule = workScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con id: " + scheduleId));

        workScheduleRepository.delete(schedule);
    }

    public List<ScheduleDto> getActiveSchedulesByDoctor(Long doctorId) {
        List<ScheduleModel> activeSchedules = workScheduleRepository.findByDoctorIdAndIsActive(doctorId, true);

        return activeSchedules.stream()
                .map(workScheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ScheduleDto getScheduleById(Long scheduleId) {
        ScheduleModel schedule = workScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con id: " + scheduleId));

        return workScheduleMapper.toDTO(schedule);
    }

    public List<ScheduleDto> getSchedulesByDoctor(Long doctorId) {
        List<ScheduleModel> schedules = workScheduleRepository.findByDoctorId(doctorId);
        return schedules.stream()
                .map(workScheduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    private void validateNoDuplicateDay(Long doctorId, Integer dayOfWeek, Long excludeScheduleId) {
        List<ScheduleModel> schedules = workScheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        if (schedules.stream().anyMatch(s -> !s.getScheduleId().equals(excludeScheduleId))) {
            throw new AppException("Ya existe un horario para este doctor en el día especificado", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateDayOfWeek(Integer dayOfWeek) {
        if (dayOfWeek < 1 || dayOfWeek > 7) {
            throw new AppException("El día de la semana debe ser un valor entre 1 (lunes) y 7 (domingo)", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (endTime.isBefore(startTime)) {
            throw new AppException("La hora de fin debe ser posterior a la hora de inicio", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateSlotDuration(Integer slotDuration, LocalTime startTime, LocalTime endTime) {
        if (slotDuration == null || slotDuration <= 0) {
            throw new AppException("La duración del turno debe ser un valor positivo", HttpStatus.BAD_REQUEST);
        }

        int totalMinutes = (endTime.getHour() * 60 + endTime.getMinute()) -
                          (startTime.getHour() * 60 + startTime.getMinute());

        if (slotDuration > totalMinutes) {
            throw new AppException("La duración del turno no puede ser mayor que el tiempo total disponible", HttpStatus.BAD_REQUEST);
        }
    }
}
