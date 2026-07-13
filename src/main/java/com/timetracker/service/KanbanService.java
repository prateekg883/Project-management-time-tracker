package com.timetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timetracker.model.Card;
import com.timetracker.model.KanbanColumn;
import com.timetracker.repository.CardRepository;
import com.timetracker.repository.KanbanColumnRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;

@Service
public class KanbanService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private KanbanColumnRepository columnRepository;

    @Autowired
    private com.timetracker.repository.BoardRepository boardRepository;

    @Autowired
    private EntityManager entityManager;

    /**
     * Move a card to a destination column and position. This is transactional and adjusts positions of affected cards.
     */
    private final java.util.concurrent.ConcurrentHashMap<Integer, java.util.concurrent.locks.ReentrantLock> columnLocks = new java.util.concurrent.ConcurrentHashMap<>();

    @Transactional
    public Card moveCard(Integer cardId, Integer destColumnId, Integer destPosition) {
        Card card = cardRepository.findById(cardId).orElseThrow(() -> new IllegalArgumentException("Card not found"));

        // Lock the card row to prevent concurrent modifications
        entityManager.lock(card, LockModeType.OPTIMISTIC);

        KanbanColumn sourceColumn = card.getColumn();
        KanbanColumn destColumn = columnRepository.findById(destColumnId).orElseThrow(() -> new IllegalArgumentException("Destination column not found"));

        int sourcePos = card.getPosition();
        int destPos = destPosition;

        Integer srcId = sourceColumn.getId();
        Integer dstId = destColumn.getId();

        // Acquire JVM-level locks for involved columns to avoid DB deadlocks under H2 while the transaction runs.
        // Always acquire in consistent order (by id) to avoid deadlock between threads.
        java.util.List<Integer> lockOrder = new java.util.ArrayList<>();
        if (srcId.equals(dstId)) {
            lockOrder.add(srcId);
        } else {
            if (srcId < dstId) {
                lockOrder.add(srcId);
                lockOrder.add(dstId);
            } else {
                lockOrder.add(dstId);
                lockOrder.add(srcId);
            }
        }

        java.util.List<java.util.concurrent.locks.ReentrantLock> acquired = new java.util.ArrayList<>();
        try {
            for (Integer id : lockOrder) {
                java.util.concurrent.locks.ReentrantLock lock = columnLocks.computeIfAbsent(id, k -> new java.util.concurrent.locks.ReentrantLock());
                lock.lock();
                acquired.add(lock);
            }

            if (sourceColumn.getId().equals(destColumn.getId())) {
                // Moving within same column
                if (destPos == sourcePos) return card; // nothing to do

                if (destPos < sourcePos) {
                    // shift cards between destPos and sourcePos-1 down
                    List<Card> affected = entityManager.createQuery("SELECT c FROM Card c WHERE c.column.id = :colId AND c.position >= :destPos AND c.position < :sourcePos ORDER BY c.position", Card.class)
                            .setParameter("colId", sourceColumn.getId())
                            .setParameter("destPos", destPos)
                            .setParameter("sourcePos", sourcePos)
                            .getResultList();
                    for (Card c : affected) {
                        c.setPosition(c.getPosition() + 1);
                        cardRepository.save(c);
                    }
                } else {
                    // destPos > sourcePos
                    List<Card> affected = entityManager.createQuery("SELECT c FROM Card c WHERE c.column.id = :colId AND c.position <= :destPos AND c.position > :sourcePos ORDER BY c.position", Card.class)
                            .setParameter("colId", sourceColumn.getId())
                            .setParameter("destPos", destPos)
                            .setParameter("sourcePos", sourcePos)
                            .getResultList();
                    for (Card c : affected) {
                        c.setPosition(c.getPosition() - 1);
                        cardRepository.save(c);
                    }
                }
                card.setPosition(destPos);
                cardRepository.save(card);
            } else {
                // Remove from source column: decrement positions greater than sourcePos
                entityManager.createQuery("UPDATE Card c SET c.position = c.position - 1 WHERE c.column.id = :sourceId AND c.position > :sourcePos")
                        .setParameter("sourceId", sourceColumn.getId())
                        .setParameter("sourcePos", sourcePos)
                        .executeUpdate();

                // Shift destination column cards at or after destPos up by 1
                entityManager.createQuery("UPDATE Card c SET c.position = c.position + 1 WHERE c.column.id = :destId AND c.position >= :destPos")
                        .setParameter("destId", destColumn.getId())
                        .setParameter("destPos", destPos)
                        .executeUpdate();

                // Move card
                card.setColumn(destColumn);
                card.setPosition(destPos);
                cardRepository.save(card);
            }

            return card;
        } finally {
            // release locks in reverse order
            for (int i = acquired.size() - 1; i >= 0; i--) {
                acquired.get(i).unlock();
            }
        }
    }

    @Transactional(readOnly = true)
    public List<KanbanColumn> getAllColumnsWithCards() {
        List<KanbanColumn> cols = columnRepository.findAll();
        for (KanbanColumn c : cols) {
            c.setCards(cardRepository.findByColumnOrderByPosition(c));
        }
        return cols;
    }

    @Transactional
    public Card createCard(Integer columnId, String title, String description) {
        KanbanColumn column = columnRepository.findById(columnId)
            .orElseThrow(() -> new RuntimeException("Column not found"));
        
        List<Card> cards = cardRepository.findByColumnOrderByPosition(column);
        int nextPosition = cards.isEmpty() ? 1 : cards.get(cards.size() - 1).getPosition() + 1;
        
        Card card = new Card();
        card.setColumn(column);
        card.setTitle(title);
        card.setDescription(description);
        card.setPosition(nextPosition);
        
        return cardRepository.save(card);
    }

    @Transactional
    public Card updateCard(Integer cardId, String title, String description) {
        Card card = cardRepository.findById(cardId)
            .orElseThrow(() -> new RuntimeException("Card not found"));
        
        card.setTitle(title);
        card.setDescription(description);
        
        return cardRepository.save(card);
    }

    @Transactional
    public void deleteCard(Integer cardId) {
        cardRepository.deleteById(cardId);
    }

    @Transactional
    public KanbanColumn createColumn(String name) {
        System.out.println("Creating column with name: " + name);
        
        List<KanbanColumn> columns = columnRepository.findAll();
        int nextPosition = columns.isEmpty() ? 1 : columns.stream()
            .mapToInt(KanbanColumn::getPosition)
            .max()
            .orElse(0) + 1;
        
        System.out.println("Next position: " + nextPosition);
        
        // Get the first board (assuming single board for now)
        List<com.timetracker.model.Board> boards = boardRepository.findAll();
        System.out.println("Found " + boards.size() + " boards");
        
        if (boards.isEmpty()) {
            throw new RuntimeException("No board found in database");
        }
        
        com.timetracker.model.Board board = boards.get(0);
        System.out.println("Using board: " + board.getName());
        
        KanbanColumn column = new KanbanColumn();
        column.setBoard(board);
        column.setName(name);
        column.setPosition(nextPosition);
        
        KanbanColumn saved = columnRepository.save(column);
        System.out.println("Column saved with ID: " + saved.getId());
        
        return saved;
    }
}
