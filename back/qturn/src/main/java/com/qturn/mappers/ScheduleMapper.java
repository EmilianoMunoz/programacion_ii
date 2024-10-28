package com.qturn.mappers;

import com.qturn.dto.ScheduleDto;
import com.qturn.models.ScheduleModel;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    ScheduleMapper INSTANCE = Mappers.getMapper(ScheduleMapper.class);
    
    ScheduleDto toDTO(ScheduleModel Schedule);
    ScheduleModel toEntity(ScheduleDto ScheduleDto);
}