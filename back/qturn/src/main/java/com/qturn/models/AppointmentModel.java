package com.qturn.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "appointments")
public class AppointmentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private UserModel patient;

    @ManyToOne
    @JoinColumn(name = "professional_id", nullable = false)
    private UserModel professional;

    @Column(name = "appointment_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentDate;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserModel getPatient() {
        return patient;
    }

    public void setPatient(UserModel patient) {
        this.patient = patient;
    }

    public UserModel getProfessional() {
        return professional;
    }

    public void setProfessional(UserModel professional) {
        this.professional = professional;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
