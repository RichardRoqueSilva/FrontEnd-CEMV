package backend.api.cmev.controllers;

import backend.api.cmev.model.Louvor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import backend.api.cmev.repositors.LouvorRepository;

import java.util.List;

@RestController
@RequestMapping("/api/louvores")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LouvorController {

    @Autowired
    private LouvorRepository repository;

    @GetMapping
    public List<Louvor> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Louvor criar(@RequestBody Louvor louvor) {
        return repository.save(louvor);
    }

    // --- NOVO: Metodo para ATUALIZAR (Editar) ---
    @PutMapping("/{id}")
    public Louvor atualizar(@PathVariable Long id, @RequestBody Louvor dadosAtualizados) {
        return repository.findById(id).map(louvor -> {
            louvor.setNomeCantor(dadosAtualizados.getNomeCantor());
            louvor.setNomeMusica(dadosAtualizados.getNomeMusica());
            louvor.setEstilo(dadosAtualizados.getEstilo());
            louvor.setLetra(dadosAtualizados.getLetra());
            return repository.save(louvor);
        }).orElse(null);
    }

    // --- NOVO: metodo para DELETAR ---
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}