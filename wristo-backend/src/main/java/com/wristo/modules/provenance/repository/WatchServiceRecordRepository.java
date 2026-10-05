package com.wristo.modules.provenance.repository;

import com.wristo.modules.provenance.entity.WatchServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchServiceRecordRepository extends JpaRepository<WatchServiceRecord, String> {
    List<WatchServiceRecord> findByProvenanceRecordIdOrderByServiceDateDesc(String provenanceRecordId);
    List<WatchServiceRecord> findByWatchIdOrderByServiceDateDesc(String watchId);
}
