package com.qturn.mappers;

import com.qturn.dto.AppointmentDto;
import com.qturn.models.AppointmentModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(source = "id", target = "id")                    
    @Mapping(source = "time", target = "time")                
    @Mapping(source = "doctor.id", target = "doctorId")       
    @Mapping(source = "patient.id", target = "patientId")     
    AppointmentDto toAppointmentDto(AppointmentModel appointment);

    @Mapping(source = "id", target = "id")                    
    @Mapping(source = "time", target = "time")                
    @Mapping(source = "doctorId", target = "doctor.id")       
    @Mapping(source = "patientId", target = "patient.id")     
    AppointmentModel toAppointmentModel(AppointmentDto appointmentDto);
}
