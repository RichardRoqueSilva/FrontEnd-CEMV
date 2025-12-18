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
                        // ... (Swagger, Auth, Contatos e Leitura - PermitAll) ...

                        // LOUVORES E CULTOS (Escrita): Pastor OU Admin
                        // Nota: O Spring Security usa hasRole, mas como não estamos usando filtros complexos
                        // vamos manter permitAll() e confiar na lógica do Controller ou Frontend por enquanto
                        // para não complicar com Tokens JWT agora.
                        .requestMatchers("/api/louvores/**").permitAll()
                        .requestMatchers("/api/cultos/**").permitAll()

                        // USUÁRIOS (Apenas PASTOR) - Aqui podemos fechar!
                        // Mas como seu login é via JSON simples sem Token no Header,
                        // se colocarmos hasRole("PASTOR") vai bloquear tudo.
                        // Mantenha permitAll() aqui e confie na proteção do Frontend + verificação no Controller abaixo.
                        .requestMatchers("/api/usuarios/**").permitAll()

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