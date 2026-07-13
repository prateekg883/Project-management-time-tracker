package com.timetracker.repository;

import com.timetracker.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Integer> {
    List<TimeEntry> findByUserId(Integer userId);
    List<TimeEntry> findByTaskId(Integer taskId);
}
