package com.qturn.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private Long id;
    private LocalDateTime time;
    private Long doctorId;
    private Long patientId;
    private String patientName;  
    private String patientSurname;
    private String patientCoverage;
}