package com.qturn.controllers;

import com.qturn.dto.ScheduleDto;
import com.qturn.services.ScheduleService;
import com.qturn.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/work-schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService workScheduleService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<ScheduleDto> createSchedule(@RequestBody ScheduleDto workScheduleDTO) {
        return new ResponseEntity<>(workScheduleService.createSchedule(workScheduleDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{scheduleId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<ScheduleDto> updateSchedule(
            @PathVariable Long scheduleId,
            @RequestBody ScheduleDto workScheduleDTO) {
        return ResponseEntity.ok(workScheduleService.updateSchedule(scheduleId, workScheduleDTO));
    }

    @DeleteMapping("/{scheduleId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long scheduleId) {
        workScheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<List<ScheduleDto>> getSchedulesByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(workScheduleService.getSchedulesByDoctor(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/active")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<ScheduleDto>> getActiveSchedulesByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(workScheduleService.getActiveSchedulesByDoctor(doctorId));
    }

    @GetMapping("/{scheduleId}")
    public ResponseEntity<ScheduleDto> getScheduleById(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(workScheduleService.getScheduleById(scheduleId));
    }

    // Manejadores de excepciones
    @ExceptionHandler(AppException.class)
    public ResponseEntity<String> handleAppException(AppException e) {
        return new ResponseEntity<>(e.getMessage(), e.getStatus());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        throw new AppException(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(IllegalStateException e) {
        throw new AppException(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}