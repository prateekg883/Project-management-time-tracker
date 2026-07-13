package com.timetracker.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timetracker.model.Card;
import com.timetracker.service.KanbanService;

@RestController
@RequestMapping("/api/kanban")
public class KanbanController {

    @Autowired
    private KanbanService kanbanService;

    @PostMapping("/cards/{id}/move")
    public ResponseEntity<?> moveCard(@PathVariable("id") Integer cardId, @RequestBody Map<String, Integer> body) {
        Integer destColumnId = body.get("destColumnId");
        Integer destPosition = body.get("destPosition");
        Card updated = kanbanService.moveCard(cardId, destColumnId, destPosition);
        return ResponseEntity.ok(Map.of(
                "id", updated.getId(),
                "columnId", updated.getColumn().getId(),
                "position", updated.getPosition()
        ));
    }

    @GetMapping("/columns")
    public ResponseEntity<?> getColumns() {
        System.out.println("=== GET /api/kanban/columns called ===");
        java.util.List<com.timetracker.model.KanbanColumn> cols = kanbanService.getAllColumnsWithCards();
        System.out.println("Found " + cols.size() + " columns");
        java.util.List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (com.timetracker.model.KanbanColumn c : cols) {
            System.out.println("Column: " + c.getName() + " with " + c.getCards().size() + " cards");
            java.util.List<java.util.Map<String, Object>> cards = new java.util.ArrayList<>();
            for (Card card : c.getCards()) {
                java.util.Map<String, Object> cardMap = new java.util.HashMap<>();
                cardMap.put("id", card.getId());
                cardMap.put("title", card.getTitle());
                cardMap.put("description", card.getDescription());
                cardMap.put("position", card.getPosition());
                if (card.getAssignee() != null) {
                    cardMap.put("assignee", Map.of("id", card.getAssignee().getId(), "fullName", card.getAssignee().getFullName()));
                }
                cards.add(cardMap);
            }
            result.add(Map.of("id", c.getId(), "name", c.getName(), "cards", cards));
        }
        System.out.println("Returning " + result.size() + " columns");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/cards")
    public ResponseEntity<?> createCard(@RequestBody Map<String, Object> body) {
        System.out.println("=== POST /api/kanban/cards called ===");
        Integer columnId = (Integer) body.get("columnId");
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        
        Card card = kanbanService.createCard(columnId, title, description);
        return ResponseEntity.ok(Map.of(
            "id", card.getId(),
            "title", card.getTitle(),
            "description", card.getDescription() != null ? card.getDescription() : "",
            "position", card.getPosition()
        ));
    }

    @PostMapping("/cards/{id}")
    public ResponseEntity<?> updateCard(@PathVariable("id") Integer cardId, @RequestBody Map<String, Object> body) {
        System.out.println("=== POST /api/kanban/cards/" + cardId + " called ===");
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        
        Card card = kanbanService.updateCard(cardId, title, description);
        return ResponseEntity.ok(Map.of(
            "id", card.getId(),
            "title", card.getTitle(),
            "description", card.getDescription() != null ? card.getDescription() : ""
        ));
    }

    @PostMapping("/cards/{id}/delete")
    public ResponseEntity<?> deleteCard(@PathVariable("id") Integer cardId) {
        System.out.println("=== DELETE /api/kanban/cards/" + cardId + " called ===");
        kanbanService.deleteCard(cardId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/columns")
    public ResponseEntity<?> createColumn(@RequestBody Map<String, Object> body) {
        System.out.println("=== POST /api/kanban/columns called ===");
        String name = (String) body.get("name");
        
        com.timetracker.model.KanbanColumn column = kanbanService.createColumn(name);
        return ResponseEntity.ok(Map.of(
            "id", column.getId(),
            "name", column.getName(),
            "position", column.getPosition()
        ));
    }
}
