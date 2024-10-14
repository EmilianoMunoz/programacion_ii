package com.qturn.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.qturn.models.AppointmentModel;
import com.qturn.services.AppointmentService;

import java.util.Optional;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<Page<AppointmentModel>> getAppointments(Pageable pageable) {
        Page<AppointmentModel> appointments = appointmentService.getAppointments(pageable);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<AppointmentModel> createAppointment(@RequestBody AppointmentModel appointment) {
        AppointmentModel createdAppointment = appointmentService.create(appointment);
        return ResponseEntity.status(201).body(createdAppointment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentModel> getAppointmentById(@PathVariable Long id) {
        Optional<AppointmentModel> appointment = appointmentService.findById(id);
        return appointment.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentModel> updateAppointment(@PathVariable Long id, @RequestBody AppointmentModel appointment) {
        AppointmentModel updatedAppointment = appointmentService.update(appointment, id);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
