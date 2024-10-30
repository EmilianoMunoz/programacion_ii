package com.qturn.controllers;

import com.qturn.dto.AppointmentDto;
import com.qturn.services.AppointmentService;
import com.qturn.exceptions.AppException;
import com.qturn.models.AppointmentModel;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<String> createAppointment(@RequestBody AppointmentDto appointmentDto) {
        try {
            appointmentService.createAppointment(appointmentDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Cita reservada con éxito");
        } catch (AppException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El horario seleccionado ya no está disponible");
        }
    }

    @GetMapping("/available-times")
    public ResponseEntity<List<String>> getAvailableTimes(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<String> availableTimes = appointmentService.findAvailableTimes(localDate);
            return ResponseEntity.ok(availableTimes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkTimeAvailability(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        try {
            boolean isAvailable = appointmentService.isTimeSlotAvailable(dateTime);
            return ResponseEntity.ok(isAvailable);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @GetMapping("/appointment/{userId}")
    public ResponseEntity<AppointmentModel> getAppointment(@PathVariable Long userId) {
        try {
            AppointmentModel appointment = appointmentService.findAppointmentForUser(userId);
            return appointment != null ? ResponseEntity.ok(appointment) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok("Cita cancelada con éxito");
        } catch (AppException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al cancelar la cita");
        }
    }

    @GetMapping("/doctor/{doctorId}/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsForDoctor(@PathVariable Long doctorId, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<AppointmentDto> appointments = appointmentService.findAppointmentsForDoctor(doctorId, localDate);
            return ResponseEntity.ok(appointments);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(List.of());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<String> updateAppointment(@PathVariable Long appointmentId, @RequestBody AppointmentDto appointmentDto, @RequestParam Long userId, @RequestParam String role) {
        try {
            if ("PATIENT".equals(role)) {
                AppointmentModel appointment = appointmentService.findAppointmentById(appointmentId)
                        .orElseThrow(() -> new AppException("Cita no encontrada", HttpStatus.NOT_FOUND));
                
                if (!appointment.getPatient().getId().equals(userId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para modificar esta cita");
                }
            } else if (!"DOCTOR".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para modificar esta cita");
            }

            appointmentService.updateAppointment(appointmentId, appointmentDto);
            return ResponseEntity.ok("Cita actualizada con éxito");

        } catch (AppException e) {
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el turno");
        }
    }
}
