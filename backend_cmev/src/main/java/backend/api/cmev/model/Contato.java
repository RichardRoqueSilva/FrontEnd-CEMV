package backend.api.cmev.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "contatos")
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String celular;

    private String cidade;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    // Salva a data e hora automaticamente quando cria
    private LocalDateTime dataRegistro = LocalDateTime.now();
}