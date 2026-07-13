package com.timetracker.repository;

import com.timetracker.model.Card;
import com.timetracker.model.KanbanColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findByColumnOrderByPosition(KanbanColumn column);
    List<Card> findByColumnIdOrderByPosition(Integer columnId);
}
