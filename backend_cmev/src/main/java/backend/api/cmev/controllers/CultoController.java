package backend.api.cmev.controllers;

import backend.api.cmev.model.Culto;
import backend.api.cmev.repositors.CultoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cultos")
@CrossOrigin(origins = "*")
public class CultoController {

    @Autowired
    private CultoRepository repository;

    @GetMapping
    public List<Culto> listar() {
        // Retorna todos (Idealmente ordenado por data)
        return repository.findAll();
    }

    @PostMapping
    public Culto criar(@RequestBody Culto culto) {
        return repository.save(culto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

    // Opcional: Editar
    @PutMapping("/{id}")
    public Culto editar(@PathVariable Long id, @RequestBody Culto dados) {
        return repository.findById(id).map(c -> {
            c.setDescricao(dados.getDescricao());
            c.setUrlImagem(dados.getUrlImagem());
            return repository.save(c);
        }).orElse(null);
    }
}
