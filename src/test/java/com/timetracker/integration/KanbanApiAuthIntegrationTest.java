package com.timetracker.integration;

import com.timetracker.model.Board;
import com.timetracker.model.Card;
import com.timetracker.model.KanbanColumn;
import com.timetracker.model.User;
import com.timetracker.model.UserRole;
import com.timetracker.repository.BoardRepository;
import com.timetracker.repository.CardRepository;
import com.timetracker.repository.KanbanColumnRepository;
import com.timetracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class KanbanApiAuthIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private KanbanColumnRepository columnRepository;

    @Autowired
    private CardRepository cardRepository;

    @BeforeEach
    public void setup() {
        cardRepository.deleteAll();
        columnRepository.deleteAll();
        boardRepository.deleteAll();
        userRepository.deleteAll();

        User u = new User();
        u.setUsername("testuser");
        u.setPassword(passwordEncoder.encode("pass123"));
        u.setRole(UserRole.TEAM_MEMBER);
        userRepository.save(u);

        Board b = new Board(); b.setName("B"); b = boardRepository.save(b);
        KanbanColumn a = new KanbanColumn(); a.setName("A"); a.setBoard(b); a = columnRepository.save(a);
        KanbanColumn d = new KanbanColumn(); d.setName("D"); d.setBoard(b); d = columnRepository.save(d);

        for (int i = 0; i < 3; i++) {
            Card c = new Card(); c.setTitle("Card " + i); c.setColumn(a); c.setPosition(i); cardRepository.save(c);
        }
    }

    @Test
    public void testLoginAndMove() {
        // login
        Map<String,String> body = Map.of("username","testuser","password","pass123");
        HttpHeaders headers = new HttpHeaders(); headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String,String>> req = new HttpEntity<>(body, headers);
        ResponseEntity<Map> loginResp = restTemplate.postForEntity("/api/auth/login", req, Map.class);
        assertEquals(200, loginResp.getStatusCodeValue());

        // get columns (cookie preserved by TestRestTemplate)
        ResponseEntity<Object[]> colsResp = restTemplate.getForEntity("/api/kanban/columns", Object[].class);
        assertEquals(200, colsResp.getStatusCodeValue());
        assertNotNull(colsResp.getBody());

        // find a card id and move it
        Object[] cols = colsResp.getBody();
        Map<String,Object> colA = (Map<String,Object>) cols[0];
        java.util.List<Map<String,Object>> cards = (java.util.List<Map<String,Object>>) colA.get("cards");
        assertFalse(cards.isEmpty());
        Integer cardId = (Integer) cards.get(0).get("id");

        Map<String,Integer> moveBody = Map.of("destColumnId", (Integer) ((Map<String,Object>) cols[1]).get("id"), "destPosition", 0);
        HttpEntity<Map<String,Integer>> moveReq = new HttpEntity<>(moveBody, headers);
        ResponseEntity<Map> moveResp = restTemplate.postForEntity("/api/kanban/cards/" + cardId + "/move", moveReq, Map.class);
        assertEquals(200, moveResp.getStatusCodeValue());
        Map resp = moveResp.getBody();
        assertEquals(0, resp.get("position"));
    }
}
