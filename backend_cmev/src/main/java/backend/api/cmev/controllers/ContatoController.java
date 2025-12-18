package backend.api.cmev.controllers;

import backend.api.cmev.model.Contato;
import backend.api.cmev.repositors.ContatoRepository;
import backend.api.cmev.services.ContatoProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin(origins = "*")
public class ContatoController {

    @Autowired
    private ContatoRepository repository;

    @Autowired
    private ContatoProducer producer;

    @PostMapping
    public Contato salvar(@RequestBody Contato contato) {
        // 1. Salva no Banco (Neon)
        Contato salvo = repository.save(contato);

        // 2. Avisa o Kafka (Confluent)
        producer.enviarNotificacao(salvo);

        return salvo;
    }
}