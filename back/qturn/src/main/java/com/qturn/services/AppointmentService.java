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
import java.util.Optional;
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

    private static final LocalTime FIRST_APPOINTMENT = LocalTime.of(8, 0);
    private static final LocalTime LAST_APPOINTMENT = LocalTime.of(23, 0);
    private static final int APPOINTMENT_DURATION = 5;

    @Transactional
    public AppointmentModel createAppointment(AppointmentDto appointmentDto) {
        
        ZonedDateTime zonedDateTime = appointmentDto.getTime().atZone(ZoneId.of("America/Argentina/Buenos_Aires"));
        LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
    
        
        if (localDateTime.isBefore(LocalDateTime.now())) {
            throw new AppException("No se pueden crear citas en el pasado", HttpStatus.BAD_REQUEST);
        }
    
        LocalTime appointmentTime = localDateTime.toLocalTime();
        if (appointmentTime.isBefore(FIRST_APPOINTMENT) || appointmentTime.isAfter(LAST_APPOINTMENT)) {
            throw new AppException("La hora debe estar entre las 9:00 y las 17:00", HttpStatus.BAD_REQUEST);
        }
    
        if (appointmentTime.getMinute() % APPOINTMENT_DURATION != 0) {
            throw new AppException("Las citas deben ser en intervalos de 30 minutos", HttpStatus.BAD_REQUEST);
        }
    
        AppointmentModel appointment = appointmentMapper.toAppointmentModel(appointmentDto);
        appointment.setTime(localDateTime);
    
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
        List<String> allTimeSlots = generateTimeSlots();
        
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        
        List<AppointmentModel> appointments = appointmentRepository.findByTimeBetween(
            startOfDay, 
            endOfDay
        );

        Set<String> bookedTimes = appointments.stream()
            .map(appointment -> appointment.getTime().toLocalTime().format(
                DateTimeFormatter.ofPattern("HH:mm")
            ))
            .collect(Collectors.toSet());

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
        if (dateTime.isBefore(LocalDateTime.now())) {
            return false;
        }

        LocalTime time = dateTime.toLocalTime();
        if (time.isBefore(FIRST_APPOINTMENT) || time.isAfter(LAST_APPOINTMENT)) {
            return false;
        }

        if (time.getMinute() % APPOINTMENT_DURATION != 0) {
            return false;
        }

        return appointmentRepository.findByTime(dateTime).isEmpty();
    }

    public AppointmentModel findAppointmentForUser(Long userId) {
        LocalDateTime now = LocalDateTime.now();
    
        List<AppointmentModel> appointments = appointmentRepository.findByPatient_IdAndTimeAfter(userId, now);
        
        return appointments.stream()
            .findFirst()
            .orElse(null);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new AppException("Cita no encontrada", HttpStatus.NOT_FOUND));

        appointmentRepository.delete(appointment);
    }

    
    public List<AppointmentDto> findAppointmentsForDoctor(Long doctorId, LocalDate date) {

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        

        List<AppointmentModel> appointments = appointmentRepository
            .findByDoctor_IdAndTimeBetween(doctorId, startOfDay, endOfDay);
        

            if (appointments.isEmpty()) {
            return new ArrayList<>();
        }
        
        return appointments.stream()
                .map(appointment -> {
                    AppointmentDto dto = appointmentMapper.toAppointmentDto(appointment);
                    dto.setPatientName(appointment.getPatient().getName());
                    dto.setPatientSurname(appointment.getPatient().getSurname());
                    dto.setPatientCoverage(appointment.getPatient().getCoverage());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void updateAppointment(Long appointmentId, AppointmentDto appointmentDto) {
        AppointmentModel appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppException("Cita no encontrada", HttpStatus.NOT_FOUND));

        appointment.setTime(appointmentDto.getTime());
        appointment.setDoctor(appointmentMapper.toAppointmentModel(appointmentDto).getDoctor());

        appointmentRepository.save(appointment);
    }

    public Optional<AppointmentModel> findAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }
}
