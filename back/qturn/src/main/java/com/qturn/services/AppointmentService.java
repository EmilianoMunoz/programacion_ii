package com.qturn.services;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.qturn.models.AppointmentModel;
import com.qturn.repositories.IAppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    public Page<AppointmentModel> getAppointments(Pageable pageable) {
        return appointmentRepository.findAll(pageable);
    }

    public AppointmentModel create(AppointmentModel appointment) {
        Date now = new Date();
        appointment.setCreatedAt(now);
        appointment.setUpdatedAt(now);
        
        return appointmentRepository.save(appointment);
    }

    public Optional<AppointmentModel> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public AppointmentModel update(AppointmentModel request, Long id) {
        Optional<AppointmentModel> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            AppointmentModel appointment = optionalAppointment.get();
            appointment.setPatient(request.getPatient());
            appointment.setProfessional(request.getProfessional());
            appointment.setAppointmentDate(request.getAppointmentDate());
            appointment.setStatus(request.getStatus());
            appointment.setUpdatedAt(new Date());
            
            return appointmentRepository.save(appointment);
        } else {
            throw new RuntimeException("Appointment not found");
        }
    }

    public Boolean delete(Long id) {
        Optional<AppointmentModel> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            appointmentRepository.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("Appointment not found");
        }
    }
}
