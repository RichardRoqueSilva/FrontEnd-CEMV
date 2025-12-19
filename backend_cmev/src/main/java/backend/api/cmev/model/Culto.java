package backend.api.cmev.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "cultos")
public class Culto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String urlImagem;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    // --- NOVO CAMPO ---
    // Valores esperados: "PREGACAO" ou "LOUVOR"
    private String tipo;

    private LocalDate dataCulto = LocalDate.now();
}