# Etapa 1: Construção (Build)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY . .

# Faz o build (gera o arquivo .jar)
RUN mvn clean package -DskipTests

# Etapa 2: Execução (Run)
FROM eclipse-temurin:21-jre
WORKDIR /app

# Pega o .jar que foi criado na etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Libera a porta 8080
EXPOSE 8080

# Comando para rodar
ENTRYPOINT ["java", "-jar", "app.jar"]