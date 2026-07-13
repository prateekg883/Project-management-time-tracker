package com.timetracker.integration;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
public class KanbanPostgresIntegrationTest {

    @Container
    public static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15.4")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "none");
    }

    @Autowired
    private com.timetracker.service.KanbanService kanbanService;

    @Autowired
    private com.timetracker.repository.BoardRepository boardRepository;

    @Autowired
    private com.timetracker.repository.KanbanColumnRepository columnRepository;

    @Autowired
    private com.timetracker.repository.CardRepository cardRepository;

    private com.timetracker.model.KanbanColumn colA;
    private com.timetracker.model.KanbanColumn colB;

    @BeforeEach
    public void setup() {
        cardRepository.deleteAll();
        columnRepository.deleteAll();
        boardRepository.deleteAll();

        com.timetracker.model.Board board = new com.timetracker.model.Board();
        board.setName("Test Board");
        board = boardRepository.save(board);

        colA = new com.timetracker.model.KanbanColumn();
        colA.setName("To Do");
        colA.setBoard(board);
        colA = columnRepository.save(colA);

        colB = new com.timetracker.model.KanbanColumn();
        colB.setName("Done");
        colB.setBoard(board);
        colB = columnRepository.save(colB);

        // Create 5 cards in column A
        for (int i = 0; i < 5; i++) {
            com.timetracker.model.Card c = new com.timetracker.model.Card();
            c.setTitle("Card " + i);
            c.setColumn(colA);
            c.setPosition(i);
            cardRepository.save(c);
        }
    }

    @Test
    public void testConcurrentMovesOnPostgres() throws Exception {
        java.util.List<com.timetracker.model.Card> initial = cardRepository.findByColumnOrderByPosition(colA);
        com.timetracker.model.Card c1 = initial.get(0);
        com.timetracker.model.Card c2 = initial.get(1);

        java.util.concurrent.ExecutorService ex = java.util.concurrent.Executors.newFixedThreadPool(2);
        java.util.concurrent.Callable<Void> t1 = () -> { kanbanService.moveCard(c1.getId(), colB.getId(), 0); return null; };
        java.util.concurrent.Callable<Void> t2 = () -> { kanbanService.moveCard(c2.getId(), colB.getId(), 0); return null; };

        java.util.concurrent.Future<Void> f1 = ex.submit(t1);
        java.util.concurrent.Future<Void> f2 = ex.submit(t2);

        f1.get();
        f2.get();
        ex.shutdown();
        ex.awaitTermination(10, java.util.concurrent.TimeUnit.SECONDS);

        java.util.List<com.timetracker.model.Card> inB = cardRepository.findByColumnOrderByPosition(colB);
        java.util.List<Integer> positions = inB.stream().map(com.timetracker.model.Card::getPosition).toList();

        // positions should be 0 and 1 in some order
        org.junit.jupiter.api.Assertions.assertEquals(2, positions.size());
        org.junit.jupiter.api.Assertions.assertTrue(positions.containsAll(java.util.List.of(0,1)));
    }
}
