package backend.api.cmev.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "louvores")
public class Louvor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeCantor;

    @Column(nullable = false)
    private String nomeMusica;

    @Enumerated(EnumType.STRING) // Salva "AGITADA" ou "LENTA" (texto) no banco
    @Column(nullable = false)
    private Estilo estilo;

    @Column(columnDefinition = "TEXT")
    private String letra;
}