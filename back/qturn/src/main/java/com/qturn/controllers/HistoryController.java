package com.qturn.controllers;

import com.qturn.models.HistoryModel;
import com.qturn.services.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    // Endpoint para agregar un nuevo historial
    @PostMapping
    public ResponseEntity<HistoryModel> addHistory(@RequestBody HistoryModel historyModel) {
        HistoryModel createdHistory = historyService.addHistory(historyModel);
        return ResponseEntity.ok(createdHistory);
    }

    // Endpoint para obtener todos los historiales
    @GetMapping
    public ResponseEntity<List<HistoryModel>> getAllHistories() {
        List<HistoryModel> histories = historyService.getAllHistories();
        return ResponseEntity.ok(histories);
    }

    // Endpoint para obtener un historial por ID
    @GetMapping("/{id}")
    public ResponseEntity<HistoryModel> getHistoryById(@PathVariable Long id) {
        Optional<HistoryModel> history = historyService.getHistoryById(id);
        return history.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para actualizar un historial
    @PutMapping("/{id}")
    public ResponseEntity<HistoryModel> updateHistory(@PathVariable Long id,
                                                      @RequestBody HistoryModel historyModel) {
        HistoryModel updatedHistory = historyService.updateHistory(id, historyModel);
        return updatedHistory != null 
               ? ResponseEntity.ok(updatedHistory)
               : ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un historial
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        historyService.deleteHistory(id);
        return ResponseEntity.noContent().build();
    }
}
