package com.qturn.services;

import com.qturn.models.WaitingListModel;
import com.qturn.repositories.IWaitingListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WaitingListService {

    @Autowired
    private IWaitingListRepository waitingListRepository;

    // Método para agregar un nuevo elemento a la lista de espera
    public WaitingListModel addWaitingList(WaitingListModel waitingListModel) {
        waitingListModel.setCreatedAt(new Date()); // Establecer la fecha de creación
        return waitingListRepository.save(waitingListModel);
    }

    // Método para obtener todos los elementos de la lista de espera
    public List<WaitingListModel> getAllWaitingLists() {
        return waitingListRepository.findAll();
    }

    // Método para obtener un elemento de la lista de espera por ID
    public Optional<WaitingListModel> getWaitingListById(Long id) {
        return waitingListRepository.findById(id);
    }

    // Método para actualizar un elemento de la lista de espera
    public WaitingListModel updateWaitingList(Long id, WaitingListModel waitingListModel) {
        // Verificar si el elemento existe
        if (waitingListRepository.existsById(id)) {
            waitingListModel.setId(id); // Establecer el ID del modelo
            waitingListModel.setCreatedAt(new Date()); // Establecer la fecha de actualización
            return waitingListRepository.save(waitingListModel);
        }
        return null; // O lanzar una excepción si no existe
    }

    // Método para eliminar un elemento de la lista de espera
    public void deleteWaitingList(Long id) {
        waitingListRepository.deleteById(id);
    }
}
