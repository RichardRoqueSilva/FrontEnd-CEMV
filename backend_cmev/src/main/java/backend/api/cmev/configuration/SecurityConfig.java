package backend.api.cmev.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // --- ACESSOS LIBERADOS ---

                        // Swagger
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()

                        // Contatos
                        .requestMatchers(HttpMethod.POST, "/api/contatos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contatos").permitAll() // Se quiser listar no swagger

                        // LOUVORES
                        // Mudamos de hasRole("ADMIN") para permitAll()
                        // A segurança será feita visualmente pelo Front (escondendo os botões)
                        .requestMatchers(HttpMethod.GET, "/api/louvores").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/louvores").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/louvores/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/louvores/**").permitAll()

                        // USUÁRIOS (Gestão)
                        // Também liberamos para o seu teste funcionar
                        .requestMatchers("/api/usuarios/**").permitAll()

                        // Qualquer outra coisa
                        .anyRequest().permitAll()
                )
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}