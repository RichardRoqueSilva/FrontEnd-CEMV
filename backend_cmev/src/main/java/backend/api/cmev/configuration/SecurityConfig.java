package backend.api.cmev.configuration;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <--- ATIVA O CORS
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // PÚBLICO
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contatos").permitAll()

                        //CULTOS
                        .requestMatchers(HttpMethod.GET, "/api/cultos").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cultos").hasAnyRole("ADMIN", "PASTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/cultos/**").hasAnyRole("ADMIN", "PASTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/cultos/**").hasAnyRole("ADMIN", "PASTOR")

                        // LEITURA PÚBLICA
                        .requestMatchers(HttpMethod.GET, "/api/louvores").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cultos").permitAll()

                        // EDIÇÃO (STAFF)
                        .requestMatchers(HttpMethod.POST, "/api/louvores").hasAnyRole("ADMIN", "PASTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/louvores/**").hasAnyRole("ADMIN", "PASTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/louvores/**").hasAnyRole("ADMIN", "PASTOR")

                        // GESTÃO (PASTOR)
                        .requestMatchers("/api/usuarios/**").hasRole("PASTOR")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // --- CONFIGURAÇÃO DO CORS ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Libera acesso para qualquer origem (pode trocar "*" por "http://localhost:5173" se quiser ser estrito)
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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