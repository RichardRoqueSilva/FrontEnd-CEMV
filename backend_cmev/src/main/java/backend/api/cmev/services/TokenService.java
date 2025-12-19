package backend.api.cmev.services;

import backend.api.cmev.model.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    // Em produção, isso deve vir de uma variável de ambiente
    private String secret = "senha-secreta-da-igreja-cemv";

    public String generateToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("API-CEMV")
                    .withSubject(usuario.getEmail())
                    .withClaim("role", usuario.getRole()) // Salva o cargo dentro do token
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token", exception);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("API-CEMV")
                    .build()
                    .verify(token)
                    .getSubject(); // Retorna o email do usuário
        } catch (JWTVerificationException exception) {
            return ""; // Token inválido
        }
    }

    private Instant genExpirationDate() {
        // Token expira em 2 horas (tempo de um culto + margem)
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}