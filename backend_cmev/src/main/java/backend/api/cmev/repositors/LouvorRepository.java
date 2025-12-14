package backend.api.cmev.repositors;

import backend.api.cmev.model.Louvor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LouvorRepository extends JpaRepository<Louvor, Long> {
    // Aqui você já ganha métodos como save(), findAll(), delete(), etc.
}