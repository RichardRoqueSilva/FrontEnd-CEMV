package backend.api.cmev.controllers;

import backend.api.cmev.model.Contato;
import backend.api.cmev.repositors.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin(origins = "*") // Permite que o React acesse
public class ContatoController {

    @Autowired
    private ContatoRepository repository;

    // 1. Salvar um novo contato (POST)
    @PostMapping
    public Contato novoContato(@RequestBody Contato contato) {
        return repository.save(contato);
    }

    // 2. Listar todos os contatos (GET) - Útil para uma futura área administrativa
    @GetMapping
    public List<Contato> listarContatos() {
        return repository.findAll();
    }
}