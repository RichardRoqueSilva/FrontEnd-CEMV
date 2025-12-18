package backend.api.cmev.controllers;

import backend.api.cmev.model.Usuario;

import backend.api.cmev.repositors.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    // Listar todos
    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    // Alterar Role (Permite escolher entre MEMBER, ADMIN, PASTOR)
    @PutMapping("/{id}/role")
    public ResponseEntity alterarPermissao(@PathVariable Long id, @RequestBody String novaRole) {
        String roleLimpa = novaRole.replace("\"", ""); // Remove aspas extras se vierem

        return repository.findById(id).map(user -> {
            user.setRole(roleLimpa);
            repository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
}
