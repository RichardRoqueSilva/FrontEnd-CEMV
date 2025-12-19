package backend.api.cmev.repositors;

import backend.api.cmev.model.Culto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CultoRepository extends JpaRepository<Culto, Long> {
}