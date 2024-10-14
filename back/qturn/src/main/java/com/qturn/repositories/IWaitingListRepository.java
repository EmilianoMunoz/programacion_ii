package com.qturn.repositories;

import com.qturn.models.WaitingListModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IWaitingListRepository extends JpaRepository<WaitingListModel, Long> {
    // Aquí puedes agregar métodos personalizados si es necesario
}
