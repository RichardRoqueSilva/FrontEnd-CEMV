# ✝️ Portal CEMV - Comunidade Evangélica Mudança de Vida

> Uma plataforma Full Stack completa para gestão eclesiástica, engajamento de membros e automação de comunicação via Mensageria.

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-green?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)
![Kafka](https://img.shields.io/badge/Kafka-Confluent-black?style=for-the-badge&logo=apachekafka)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)

## 📋 Sobre o Projeto

Este projeto é uma aplicação web desenvolvida para modernizar a comunicação da igreja CEMV. Ele oferece uma experiência interativa para os membros (leitura bíblica, louvores, cultos) e um painel administrativo robusto para a liderança.

O grande diferencial técnico é a implementação de uma **Arquitetura Orientada a Eventos (EDA)**. Utilizamos **Apache Kafka** para desacoplar o envio de notificações de contato, garantindo que a API responda instantaneamente ao usuário enquanto o processamento pesado (envio de e-mail) ocorre em segundo plano.

---

## ⚙️ Arquitetura do Sistema

O sistema foi desenhado seguindo os princípios de **Clean Code**, **SOLID** e **Responsabilidade Única**.

### Fluxo de Mensageria (Contato)
1.  **Frontend:** Usuário preenche o formulário de contato.
2.  **API REST:** Recebe os dados, valida e salva no **PostgreSQL (Neon)**.
3.  **Producer:** A API publica um evento no tópico `notificacao-contato` no **Kafka (Confluent Cloud)**.
4.  **Resposta:** A API responde "Sucesso" ao usuário imediatamente (baixa latência).
5.  **Consumer:** Um serviço background escuta o tópico, processa a mensagem e dispara o e-mail via **SMTP (Brevo)**.

---

## 🚀 Funcionalidades Principais

### 📖 Bíblia Inteligente
*   **Leitura Diária:** Algoritmo que calcula a meta de capítulos baseado no plano escolhido (Anual, Semestral, Trimestral).
*   **Acessibilidade (Text-to-Speech):** Leitura em voz alta utilizando a API nativa do navegador, com controle de velocidade (0.75x a 2.0x) e seleção de vozes neurais.
*   **Ferramentas de Estudo:** Sistema de grifos coloridos e anotações pessoais, persistidos localmente (`localStorage`).

### 🎵 Louvores & Cultos
*   **Catálogo de Músicas:** Busca rápida e modal para visualização de letras.
*   **Galeria de Cultos:** Carrossel 3D interativo com fotos e legendas dos últimos eventos.
*   **Upload de Imagens:** Conversão automática para Base64 para armazenamento direto no banco.

### 🔐 Segurança & Gestão (RBAC)
Sistema de controle de acesso baseado em cargos:
*   **👤 MEMBRO:** Acesso de leitura, salvar progresso bíblico e anotações pessoais.
*   **🛠️ ADMIN:** Permissão para criar/editar/excluir Louvores e Fotos dos Cultos.
*   **✝️ PASTOR:** Acesso total + Painel de Gestão de Usuários (Promover/Rebaixar membros e admins).

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)
*   **Java 21 LTS**
*   **Spring Boot 3** (Web, Data JPA, Security, Mail, Kafka)
*   **Spring Security + JWT:** Autenticação stateless.
*   **Hibernate/JPA:** ORM para banco de dados.
*   **Apache Kafka:** Mensageria assíncrona.
*   **JUnit 5 + Mockito:** Testes unitários e de integração com banco H2 em memória.

### Frontend (Client)
*   **React.js + Vite:** SPA rápida e otimizada.
*   **CSS Modules:** Estilização componentizada e responsiva.
*   **Context API:** Gerenciamento de estado global (AuthContext).
*   **SweetAlert2:** Feedback visual elegante.

### Infraestrutura (Cloud)
*   **Render:** Hospedagem do Backend Java (Dockerizado).
*   **Vercel:** Hospedagem do Frontend React.
*   **Neon.tech:** Banco de dados PostgreSQL Serverless.
*   **Confluent Cloud:** Cluster Kafka gerenciado.
*   **Brevo (Sendinblue):** Servidor SMTP para envio de e-mails.

---

## 🔧 Como Rodar Localmente

### Pré-requisitos
*   Java 21 JDK
*   Node.js (v18+)
*   Maven

### 1. Configuração do Backend
```bash
cd backend_cmev

# Configure as variáveis de ambiente no IntelliJ ou no terminal:
# BREVO_API_KEY=sua_chave_smtp
# (E as credenciais do banco/kafka no application.properties se não estiverem hardcoded)

# Rodar a aplicação
mvn spring-boot:run
