package com.qturn.repositories;

import com.qturn.models.HistoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IHistoryRepository extends JpaRepository<HistoryModel, Long> {
    // Puedes agregar métodos de consulta personalizados aquí si es necesario
}
