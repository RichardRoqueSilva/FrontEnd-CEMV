package backend.api.cmev.controllers;

import backend.api.cmev.configuration.SecurityFilter;
import backend.api.cmev.model.Contato;
import backend.api.cmev.repositors.ContatoRepository;
import backend.api.cmev.repositors.UsuarioRepository;
import backend.api.cmev.services.ContatoProducer;
import backend.api.cmev.services.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import backend.api.cmev.configuration.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContatoController.class)
@Import({SecurityConfig.class, SecurityFilter.class}) // Importa a segurança para o teste funcionar
public class ContatoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- MOCKS OBRIGATÓRIOS PARA O CONTROLLER ---
    @MockitoBean
    private ContatoRepository contatoRepository;

    @MockitoBean
    private ContatoProducer contatoProducer; // Mudamos o nome do serviço para ContatoProducer lembra?

    // --- MOCKS OBRIGATÓRIOS PARA A SEGURANÇA (SecurityFilter) ---
    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @Test
    public void deveReceberPostContatoRetornar200() throws Exception {
        // 1. Cenário
        Contato novoContato = new Contato();
        novoContato.setNome("Visitante Teste");
        novoContato.setCelular("16999999999");
        novoContato.setMotivo("Quero visitar");

        // Mock: Quando tentar salvar, finge que salvou e retorna o objeto
        when(contatoRepository.save(any(Contato.class))).thenReturn(novoContato);

        // 2. Ação e Validação
        // A rota /api/contatos é pública (.permitAll), então deve funcionar sem token
        mockMvc.perform(post("/api/contatos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(novoContato)))
                .andExpect(status().isOk());
    }
}