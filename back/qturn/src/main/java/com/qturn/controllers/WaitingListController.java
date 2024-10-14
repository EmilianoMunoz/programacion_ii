package com.qturn.controllers;

import com.qturn.models.WaitingListModel;
import com.qturn.services.WaitingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/waiting-list")
public class WaitingListController {

    @Autowired
    private WaitingListService waitingListService;

    @PostMapping
    public ResponseEntity<WaitingListModel> addWaitingList(@RequestBody WaitingListModel waitingListModel) {
        WaitingListModel createdWaitingList = waitingListService.addWaitingList(waitingListModel);
        return ResponseEntity.ok(createdWaitingList);
    }

    @GetMapping
    public ResponseEntity<List<WaitingListModel>> getAllWaitingLists() {
        List<WaitingListModel> waitingLists = waitingListService.getAllWaitingLists();
        return ResponseEntity.ok(waitingLists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WaitingListModel> getWaitingListById(@PathVariable Long id) {
        Optional<WaitingListModel> waitingList = waitingListService.getWaitingListById(id);
        return waitingList.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WaitingListModel> updateWaitingList(@PathVariable Long id,
                                                               @RequestBody WaitingListModel waitingListModel) {
        WaitingListModel updatedWaitingList = waitingListService.updateWaitingList(id, waitingListModel);
        return updatedWaitingList != null 
               ? ResponseEntity.ok(updatedWaitingList)
               : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWaitingList(@PathVariable Long id) {
        waitingListService.deleteWaitingList(id);
        return ResponseEntity.noContent().build();
    }
}
