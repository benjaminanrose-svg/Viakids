package com.viakids.repository;

import com.viakids.model.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findByStudentId(Long studentId);
    List<Absence> findByApoderadoId(Long apoderadoId);
    List<Absence> findByDate(LocalDate date);

    @Query("SELECT a FROM Absence a JOIN a.student s WHERE s.id IN " +
           "(SELECT st.id FROM Student st WHERE st.apoderado.id = :apoderadoId) AND a.date = :date")
    List<Absence> findByApoderadoIdAndDate(@Param("apoderadoId") Long apoderadoId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Absence a WHERE a.date = :date")
    List<Absence> findTodayAbsencesForConductor(@Param("date") LocalDate date);
}
