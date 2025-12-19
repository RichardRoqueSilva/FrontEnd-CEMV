package backend.api.cmev.service;

import backend.api.cmev.model.Contato;
import backend.api.cmev.services.KafkaProducerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class KafkaProducerServiceTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    // Spy usa o objeto real do ObjectMapper para testar a conversão JSON de verdade
    @Spy
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @InjectMocks
    private KafkaProducerService producerService;

    @Test
    public void deveEnviarMensagemKafka() throws JsonProcessingException {
        // 1. Cenário
        Contato contato = new Contato();
        contato.setNome("Maria Teste");
        contato.setCelular("11988888888");

        // 2. Ação
        producerService.enviarMensagem(contato);

        // 3. Verificação
        // Verifica se o metodo .send() foi chamado com o tópico correto
        verify(kafkaTemplate).send(eq("notificacao-contato"), anyString());
    }
}
