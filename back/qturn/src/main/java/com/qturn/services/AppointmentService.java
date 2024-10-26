package com.qturn.services;

import com.qturn.models.AppointmentModel;
import com.qturn.repositories.IAppointmentRepository;
import com.qturn.dto.AppointmentDto;
import com.qturn.exceptions.AppException;
import com.qturn.mappers.AppointmentMapper;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    
    private static final LocalTime FIRST_APPOINTMENT = LocalTime.of(9, 0);
    private static final LocalTime LAST_APPOINTMENT = LocalTime.of(17, 0);
    private static final int APPOINTMENT_DURATION = 30; // duración en minutos

    @Transactional
    public AppointmentModel createAppointment(AppointmentDto appointmentDto) {
        
        // Convertir la hora de la cita a la zona horaria local (Argentina)
        ZonedDateTime zonedDateTime = appointmentDto.getTime().atZone(ZoneId.of("America/Argentina/Buenos_Aires"));
        LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
    
        // Validar que la fecha no sea en el pasado
        if (localDateTime.isBefore(LocalDateTime.now())) {
            throw new AppException("No se pueden crear citas en el pasado", HttpStatus.BAD_REQUEST);
        }
    
        // Validar que la hora esté dentro del horario de atención
        LocalTime appointmentTime = localDateTime.toLocalTime();
        if (appointmentTime.isBefore(FIRST_APPOINTMENT) || appointmentTime.isAfter(LAST_APPOINTMENT)) {
            throw new AppException("La hora debe estar entre las 9:00 y las 17:00", HttpStatus.BAD_REQUEST);
        }
    
        // Validar que la hora sea en intervalos de 30 minutos
        if (appointmentTime.getMinute() % APPOINTMENT_DURATION != 0) {
            throw new AppException("Las citas deben ser en intervalos de 30 minutos", HttpStatus.BAD_REQUEST);
        }
    
        // Crear la cita con la hora convertida
        AppointmentModel appointment = appointmentMapper.toAppointmentModel(appointmentDto);
        appointment.setTime(localDateTime);
    
        // Verificar si ya existe una cita para ese doctor en ese horario
        boolean exists = !appointmentRepository.findByDoctorAndTime(
            appointment.getDoctor(), 
            appointment.getTime()
        ).isEmpty();
    
        if (exists) {
            throw new AppException(
                "El doctor ya tiene una cita reservada en este horario", 
                HttpStatus.CONFLICT
            );
        }
    
        return appointmentRepository.save(appointment);
    }

    public List<String> findAvailableTimes(LocalDate date) {
        // Generar todos los slots posibles
        List<String> allTimeSlots = generateTimeSlots();
        
        // Obtener todas las citas del día
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        
        List<AppointmentModel> appointments = appointmentRepository.findByTimeBetween(
            startOfDay, 
            endOfDay
        );

        // Convertir las citas existentes a un Set de strings para búsqueda eficiente
        Set<String> bookedTimes = appointments.stream()
            .map(appointment -> appointment.getTime().toLocalTime().format(
                DateTimeFormatter.ofPattern("HH:mm")
            ))
            .collect(Collectors.toSet());

        // Filtrar los horarios ocupados
        return allTimeSlots.stream()
            .filter(time -> !bookedTimes.contains(time))
            .collect(Collectors.toList());
    }

    private List<String> generateTimeSlots() {
        List<String> slots = new ArrayList<>();
        LocalTime currentTime = FIRST_APPOINTMENT;
        
        while (!currentTime.isAfter(LAST_APPOINTMENT)) {
            slots.add(currentTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            currentTime = currentTime.plusMinutes(APPOINTMENT_DURATION);
        }
        
        return slots;
    }

    public boolean isTimeSlotAvailable(LocalDateTime dateTime) {
        // Validar que la fecha no sea en el pasado
        if (dateTime.isBefore(LocalDateTime.now())) {
            return false;
        }

        // Validar que la hora esté dentro del horario de atención
        LocalTime time = dateTime.toLocalTime();
        if (time.isBefore(FIRST_APPOINTMENT) || time.isAfter(LAST_APPOINTMENT)) {
            return false;
        }

        // Validar que la hora sea en intervalos de 30 minutos
        if (time.getMinute() % APPOINTMENT_DURATION != 0) {
            return false;
        }

        // Verificar si existe una cita en ese horario
        return appointmentRepository.findByTime(dateTime).isEmpty();
    }

    public AppointmentModel findAppointmentForUser(Long userId) {
        // Obtener la fecha y hora actual
        LocalDateTime now = LocalDateTime.now();
    
        // Buscar la próxima cita para el paciente (userId se refiere al paciente)
        List<AppointmentModel> appointments = appointmentRepository.findByPatient_IdAndTimeAfter(userId, now);
        
        // Retornar la próxima cita, si existe
        return appointments.stream()
            .findFirst()
            .orElse(null); // Devuelve null si no hay citas
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new AppException("Cita no encontrada", HttpStatus.NOT_FOUND));

        appointmentRepository.delete(appointment);
    }

    
    public List<AppointmentDto> findAppointmentsForDoctor(Long doctorId, LocalDate date) {
        // Definir inicio y fin del día
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        // Buscar citas entre inicio y fin del día
        List<AppointmentModel> appointments = appointmentRepository
            .findByDoctor_IdAndTimeBetween(doctorId, startOfDay, endOfDay);
        
        // Si no hay citas, retornar lista vacía explícitamente
        if (appointments.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Mapear las citas a DTOs
        return appointments.stream()
                .map(appointment -> {
                    AppointmentDto dto = appointmentMapper.toAppointmentDto(appointment);
                    dto.setPatientName(appointment.getPatient().getName());
                    dto.setPatientCoverage(appointment.getPatient().getCoverage());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
}