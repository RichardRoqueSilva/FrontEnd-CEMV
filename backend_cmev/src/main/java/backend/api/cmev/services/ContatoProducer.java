package backend.api.cmev.services;

import backend.api.cmev.model.Contato;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ContatoProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void enviarNotificacao(Contato contato) {
        try {
            // Transforma o objeto Contato em texto JSON
            String json = objectMapper.writeValueAsString(contato);

            // Envia para o tópico que criamos na Confluent
            kafkaTemplate.send("notificacao-contato", json);

            System.out.println(">>> KAFKA PRODUCER: Mensagem enviada para a nuvem: " + contato.getNome());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
