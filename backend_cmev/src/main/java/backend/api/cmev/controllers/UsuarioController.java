package backend.api.cmev.controllers;

import backend.api.cmev.model.Usuario;

import backend.api.cmev.repositors.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // Listar todos os usuários
    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    // Alterar permissão (Tornar Admin ou Membro)
    @PutMapping("/{id}/role")
    public Usuario alterarPermissao(@PathVariable Long id, @RequestBody String novaRole) {
        // novaRole deve vir como "ADMIN" ou "MEMBER" (pode precisar tirar aspas se o front mandar JSON puro)
        String roleLimpa = novaRole.replace("\"", "");

        return repository.findById(id).map(user -> {
            user.setRole(roleLimpa);
            return repository.save(user);
        }).orElse(null);
    }
}
