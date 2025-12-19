package backend.api.cmev.controllers;

import backend.api.cmev.model.Usuario;
import backend.api.cmev.repositors.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import backend.api.cmev.services.TokenService;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private TokenService tokenService; // Injetar

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody Usuario dadosLogin) {
        Usuario user = repository.findByEmail(dadosLogin.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body("Usuário não encontrado");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (encoder.matches(dadosLogin.getSenha(), user.getSenha())) {

            // GERA O TOKEN
            String token = tokenService.generateToken(user);

            // Retorna Token + Dados do Usuário
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "nome", user.getNome(),
                    "role", user.getRole(),
                    "email", user.getEmail()
            ));

        } else {
            return ResponseEntity.status(401).body("Senha incorreta");
        }
    }

    // CADASTRO (Atualizado para receber Nome)
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody Usuario data) {
        if (repository.findByEmail(data.getEmail()) != null) return ResponseEntity.badRequest().body("Email já existe");

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.getSenha());
        Usuario newUser = new Usuario();
        newUser.setNome(data.getNome()); // <--- Salva o nome
        newUser.setEmail(data.getEmail());
        newUser.setSenha(encryptedPassword);

        // Define role padrão se não vier (segurança)
        newUser.setRole(data.getRole() != null ? data.getRole() : "MEMBER");

        repository.save(newUser);

        return ResponseEntity.ok().build();
    }
}
