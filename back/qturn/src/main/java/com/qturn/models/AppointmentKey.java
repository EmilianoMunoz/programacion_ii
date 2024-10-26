package com.qturn.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Embeddable
public class AppointmentKey {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime time;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppointmentKey)) return false;
        AppointmentKey that = (AppointmentKey) o;
        return id.equals(that.id) && time.equals(that.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, time);
    }

    public void setId(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'setId'");
    }
}
