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

        // Servidor oficial da Microsoft (funciona melhor que o smtp-mail.outlook.com)
        mailSender.setHost("smtp.office365.com");
        mailSender.setPort(587);

        mailSender.setUsername("igrejacemv@outlook.com");

        // 🔴 COLOQUE AQUI A SENHA DE APP GERADA NO SITE DA MICROSOFT
        // NÃO use sua senha de login normal!
        mailSender.setPassword("Jesussalva*");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true"); // Força segurança

        // Debug para vermos o erro exato se falhar
        props.put("mail.debug", "true");

        return mailSender;
    }
}