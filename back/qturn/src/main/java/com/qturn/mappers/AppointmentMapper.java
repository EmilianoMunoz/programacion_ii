package com.qturn.mappers;

import com.qturn.dto.AppointmentDto;
import com.qturn.models.AppointmentModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(source = "id", target = "id")                    // Mapea el ID de la cita
    @Mapping(source = "time", target = "time")                // Mapea la fecha y hora
    @Mapping(source = "doctor.id", target = "doctorId")       // Mapea el ID del doctor
    @Mapping(source = "patient.id", target = "patientId")     // Mapea el ID del paciente
    AppointmentDto toAppointmentDto(AppointmentModel appointment);

    @Mapping(source = "id", target = "id")                    // Mapea el ID de la cita
    @Mapping(source = "time", target = "time")                // Mapea la fecha y hora
    @Mapping(source = "doctorId", target = "doctor.id")       // Mapea el ID del doctor
    @Mapping(source = "patientId", target = "patient.id")     // Mapea el ID del paciente
    AppointmentModel toAppointmentModel(AppointmentDto appointmentDto);
}
