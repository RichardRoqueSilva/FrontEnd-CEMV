package backend.api.cmev.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
@Table(name = "contatos")
public class Contato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String celular;
    private String cidade;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    // MUDANÇA AQUI:
    // Em vez de LocalDateTime, usamos String.
    // O Jackson (JSON) sabe ler String nativamente, então o erro desaparece.
    private String dataRegistro = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
}