package backend.api.cmev.repository;

import backend.api.cmev.model.Contato;
import backend.api.cmev.repositors.ContatoRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

@DataJpaTest // Sobe apenas a camada de Banco de Dados (H2)
public class ContatoRepositoryTest {

    @Autowired
    private ContatoRepository repository;

    @Test
    @DisplayName("Deve salvar um contato no banco H2 e retornar com sucesso")
    public void deveSalvarContato() {
        // 1. Arrange (Cenário)
        Contato contato = new Contato();
        contato.setNome("Teste Unitario");
        contato.setCelular("1699999999");
        contato.setCidade("Araraquara");
        contato.setMotivo("Oração");

        // 2. Act (Ação)
        Contato salvo = repository.save(contato);

        // 3. Assert (Verificação)
        Assertions.assertNotNull(salvo.getId()); // O banco gerou um ID?
        Assertions.assertEquals("Teste Unitario", salvo.getNome());
    }

    @Test
    @DisplayName("Deve listar contatos")
    public void deveListarContatos() {
        Contato c1 = new Contato(); c1.setNome("A"); c1.setCelular("1");
        Contato c2 = new Contato(); c2.setNome("B"); c2.setCelular("2");

        repository.save(c1);
        repository.save(c2);

        List<Contato> lista = repository.findAll();
        Assertions.assertEquals(2, lista.size());
    }
}
