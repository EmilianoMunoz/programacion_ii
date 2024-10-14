package com.qturn.services;

import com.qturn.models.HistoryModel;
import com.qturn.repositories.IHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoryService {

    @Autowired
    private IHistoryRepository historyRepository;

    // Método para agregar un nuevo historial
    public HistoryModel addHistory(HistoryModel historyModel) {
        return historyRepository.save(historyModel);
    }

    // Método para obtener todos los historiales
    public List<HistoryModel> getAllHistories() {
        return historyRepository.findAll();
    }

    // Método para obtener un historial por ID
    public Optional<HistoryModel> getHistoryById(Long id) {
        return historyRepository.findById(id);
    }

    // Método para actualizar un historial
    public HistoryModel updateHistory(Long id, HistoryModel historyModel) {
        if (historyRepository.existsById(id)) {
            historyModel.setId(id);
            return historyRepository.save(historyModel);
        }
        return null;
    }

    // Método para eliminar un historial
    public void deleteHistory(Long id) {
        historyRepository.deleteById(id);
    }
}
