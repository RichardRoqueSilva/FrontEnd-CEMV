package backend.api.cmev.services;

import backend.api.cmev.model.Contato;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void enviarMensagem(Contato contato) {
        try {
            String mensagemJson = objectMapper.writeValueAsString(contato);
            kafkaTemplate.send("notificacao-contato", mensagemJson);
            System.out.println(">>> KAFKA: Mensagem enviada com sucesso: " + contato.getNome());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}