package com.qturn.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "appointments")
public class AppointmentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_doctor_id", nullable = false) 
    private UserModel doctor;

    @ManyToOne
    @JoinColumn(name = "fk_patient_id", nullable = false) 
    private UserModel patient;

    private LocalDateTime time; 
}
