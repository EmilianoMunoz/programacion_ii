package com.qturn.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ScheduleDto {
    private Long scheduleId;
    private Long doctorId;
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer slotDuration;
    private Boolean isActive;
}