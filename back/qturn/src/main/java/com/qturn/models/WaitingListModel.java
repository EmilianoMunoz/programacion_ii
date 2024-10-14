package com.qturn.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "waiting_list")
public class WaitingListModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private UserModel patient;

    @Column(name = "preferred_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date preferredDate;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

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

    public Date getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(Date preferredDate) {
        this.preferredDate = preferredDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}
