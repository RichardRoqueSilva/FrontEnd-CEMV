package backend.api.cmev.services;

import backend.api.cmev.model.Contato;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContatoConsumer {

    // E-mail que receberá as notificações
    private static final String EMAIL_DESTINO = "richard100@gmail.com";

    @Autowired
    private JavaMailSender mailSender;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "notificacao-contato", groupId = "cemv-grupo-notificacao")
    public void receberNotificacao(String mensagemJson) {
        try {
            // 1. Converter JSON para Objeto
            Contato contato = objectMapper.readValue(mensagemJson, Contato.class);

            System.out.println(">>> KAFKA: Processando contato de: " + contato.getNome());

            // 2. Montar e Enviar E-mail
            enviarEmail(contato);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void enviarEmail(Contato contato) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();

            // Configuração do E-mail
            mensagem.setFrom("igrejacemv@outlook.com"); // Quem envia (deve ser o mesmo do properties)
            mensagem.setTo(EMAIL_DESTINO);             // Quem recebe
            mensagem.setSubject("Nova Mensagem do Site - CEMV"); // Assunto

            // Corpo do E-mail
            String texto = String.format("""
                Olá, Pastor/Secretaria!
                
                Uma nova pessoa entrou em contato pelo site da igreja.
                
                ------------------------------------------
                DADOS DO CONTATO:
                ------------------------------------------
                Nome: %s
                Celular: %s
                Cidade: %s
                
                MOTIVO:
                %s
                
                Data do Registro: %s
                ------------------------------------------
                
                Favor entrar em contato o mais breve possível.
                Deus abençoe!
                """,
                    contato.getNome(),
                    contato.getCelular(),
                    contato.getCidade(),
                    contato.getMotivo(),
                    contato.getDataRegistro()
            );

            mensagem.setText(texto);

            // Envia de verdade
            mailSender.send(mensagem);

            System.out.println(">>> E-MAIL: Enviado com sucesso para " + EMAIL_DESTINO);

        } catch (Exception e) {
            System.err.println("Erro ao enviar E-mail: " + e.getMessage());
        }
    }
}