package com.timetracker.service;

import com.timetracker.model.Board;
import com.timetracker.model.Card;
import com.timetracker.model.KanbanColumn;
import com.timetracker.repository.CardRepository;
import com.timetracker.repository.KanbanColumnRepository;
import com.timetracker.repository.BoardRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@SpringBootTest
public class KanbanServiceIntegrationTest {

    @Autowired
    private KanbanService kanbanService;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private KanbanColumnRepository columnRepository;

    @Autowired
    private CardRepository cardRepository;

    private KanbanColumn colA;
    private KanbanColumn colB;

    @BeforeEach
    @Transactional
    public void setup() {
        cardRepository.deleteAll();
        columnRepository.deleteAll();
        boardRepository.deleteAll();

        Board board = new Board();
        board.setName("Test Board");
        board = boardRepository.save(board);

        colA = new KanbanColumn();
        colA.setName("To Do");
        colA.setBoard(board);
        colA = columnRepository.save(colA);

        colB = new KanbanColumn();
        colB.setName("Done");
        colB.setBoard(board);
        colB = columnRepository.save(colB);

        // Create 5 cards in column A
        for (int i = 0; i < 5; i++) {
            Card c = new Card();
            c.setTitle("Card " + i);
            c.setColumn(colA);
            c.setPosition(i);
            cardRepository.save(c);
        }
    }

    @Test
    public void testMoveWithinSameColumn() {
        List<Card> initial = cardRepository.findByColumnOrderByPosition(colA);
        Card toMove = initial.get(1); // position 1

        kanbanService.moveCard(toMove.getId(), colA.getId(), 3);

        List<Card> after = cardRepository.findByColumnOrderByPosition(colA);
        List<Integer> positions = after.stream().map(Card::getPosition).collect(Collectors.toList());
        Assertions.assertEquals(List.of(0,1,2,3,4), positions);
        Assertions.assertEquals("Card 1", after.get(3).getTitle());
    }

    @Test
    public void testConcurrentMoves() throws InterruptedException, ExecutionException {
        List<Card> initial = cardRepository.findByColumnOrderByPosition(colA);
        Card c1 = initial.get(0);
        Card c2 = initial.get(1);

        ExecutorService ex = Executors.newFixedThreadPool(2);
        Callable<Void> t1 = () -> { kanbanService.moveCard(c1.getId(), colB.getId(), 0); return null; };
        Callable<Void> t2 = () -> { kanbanService.moveCard(c2.getId(), colB.getId(), 0); return null; };

        Future<Void> f1 = ex.submit(t1);
        Future<Void> f2 = ex.submit(t2);

        f1.get();
        f2.get();
        ex.shutdown();
        ex.awaitTermination(5, TimeUnit.SECONDS);

        List<Card> inB = cardRepository.findByColumnOrderByPosition(colB);
        List<Integer> positions = inB.stream().map(Card::getPosition).collect(Collectors.toList());

        // positions should be 0 and 1 in some order
        Assertions.assertEquals(2, positions.size());
        Assertions.assertTrue(positions.containsAll(List.of(0,1)));
    }
}
