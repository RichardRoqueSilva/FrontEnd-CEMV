package backend.api.cmev.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Servidor do Brevo (Super estável para Apps)
        mailSender.setHost("smtp-relay.brevo.com");
        mailSender.setPort(587);

        // 🔴 COLOQUE O E-MAIL QUE VOCÊ USOU PARA CRIAR A CONTA NO BREVO
        mailSender.setUsername("9e703c001@smtp-brevo.com"); // Exemplo (use o real do cadastro)

        // 🔴 MUDANÇA AQUI: Ler de Variável de Ambiente
        // Se a variável não existir (ex: rodando local sem config), usa uma string vazia ou placeholder
        String senhaBrevo = System.getenv("BREVO_API_KEY");

        if (senhaBrevo == null || senhaBrevo.isEmpty()) {
            // Apenas para não quebrar a compilação, mas não vai enviar e-mail se não configurar
            // NÃO COLOQUE A SENHA REAL AQUI
            senhaBrevo = "CONFIGURAR_VARIAVEL_AMBIENTE";
        }

        mailSender.setPassword(senhaBrevo);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");

        // Debug para confirmar o sucesso
        props.put("mail.debug", "true");

        return mailSender;
    }
}