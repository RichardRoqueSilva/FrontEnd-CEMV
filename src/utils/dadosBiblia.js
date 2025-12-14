export const LISTA_LIVROS = [
  { nome: "Gênesis", caps: 50 }, { nome: "Êxodo", caps: 40 }, { nome: "Levítico", caps: 27 },
  { nome: "Números", caps: 36 }, { nome: "Deuteronômio", caps: 34 }, { nome: "Josué", caps: 24 },
  { nome: "Juízes", caps: 21 }, { nome: "Rute", caps: 4 }, { nome: "1 Samuel", caps: 31 },
  { nome: "2 Samuel", caps: 24 }, { nome: "1 Reis", caps: 22 }, { nome: "2 Reis", caps: 25 },
  { nome: "1 Crônicas", caps: 29 }, { nome: "2 Crônicas", caps: 36 }, { nome: "Esdras", caps: 10 },
  { nome: "Neemias", caps: 13 }, { nome: "Ester", caps: 10 }, { nome: "Jó", caps: 42 },
  { nome: "Salmos", caps: 150 }, { nome: "Provérbios", caps: 31 }, { nome: "Eclesiastes", caps: 12 },
  { nome: "Cânticos", caps: 8 }, { nome: "Isaías", caps: 66 }, { nome: "Jeremias", caps: 52 },
  { nome: "Lamentações", caps: 5 }, { nome: "Ezequiel", caps: 48 }, { nome: "Daniel", caps: 12 },
  { nome: "Oseias", caps: 14 }, { nome: "Joel", caps: 3 }, { nome: "Amós", caps: 9 },
  { nome: "Obadias", caps: 1 }, { nome: "Jonas", caps: 4 }, { nome: "Miqueias", caps: 7 },
  { nome: "Naum", caps: 3 }, { nome: "Habacuque", caps: 3 }, { nome: "Sofonias", caps: 3 },
  { nome: "Ageu", caps: 2 }, { nome: "Zacarias", caps: 14 }, { nome: "Malaquias", caps: 4 },
  { nome: "Mateus", caps: 28 }, { nome: "Marcos", caps: 16 }, { nome: "Lucas", caps: 24 },
  { nome: "João", caps: 21 }, { nome: "Atos", caps: 28 }, { nome: "Romanos", caps: 16 },
  { nome: "1 Coríntios", caps: 16 }, { nome: "2 Coríntios", caps: 13 }, { nome: "Gálatas", caps: 6 },
  { nome: "Efésios", caps: 6 }, { nome: "Filipenses", caps: 4 }, { nome: "Colossenses", caps: 4 },
  { nome: "1 Tessalonicenses", caps: 5 }, { nome: "2 Tessalonicenses", caps: 3 }, { nome: "1 Timóteo", caps: 6 },
  { nome: "2 Timóteo", caps: 4 }, { nome: "Tito", caps: 3 }, { nome: "Filemom", caps: 1 },
  { nome: "Hebreus", caps: 13 }, { nome: "Tiago", caps: 5 }, { nome: "1 Pedro", caps: 5 },
  { nome: "2 Pedro", caps: 3 }, { nome: "1 João", caps: 5 }, { nome: "2 João", caps: 1 },
  { nome: "3 João", caps: 1 }, { nome: "Judas", caps: 1 }, { nome: "Apocalipse", caps: 22 }
];

// 1. Gera a Ordem BÍBLICA (Padrão)
export const BIBLIA_COMPLETA = [];
LISTA_LIVROS.forEach(livro => {
  for (let i = 1; i <= livro.caps; i++) {
    BIBLIA_COMPLETA.push({ livro: livro.nome, cap: i });
  }
});

// 2. Definição da Ordem CRONOLÓGICA (Simplificada por Blocos)
// A lógica aqui insere livros históricos e proféticos na ordem que aconteceram
const BLOCOS_CRONOLOGICOS = [
    { livro: "Gênesis", de: 1, ate: 11 },
    { livro: "Jó", de: 1, ate: 42 }, // Jó acontece na era dos Patriarcas
    { livro: "Gênesis", de: 12, ate: 50 },
    { livro: "Êxodo", de: 1, ate: 40 },
    { livro: "Levítico", de: 1, ate: 27 },
    { livro: "Números", de: 1, ate: 36 },
    { livro: "Deuteronômio", de: 1, ate: 34 },
    { livro: "Salmos", de: 90, ate: 90 }, // Salmo de Moisés
    { livro: "Josué", de: 1, ate: 24 },
    { livro: "Juízes", de: 1, ate: 21 },
    { livro: "Rute", de: 1, ate: 4 },
    { livro: "1 Samuel", de: 1, ate: 31 },
    { livro: "2 Samuel", de: 1, ate: 24 },
    { livro: "1 Crônicas", de: 1, ate: 29 }, // Crônicas recapitula Samuel/Reis
    { livro: "Salmos", de: 1, ate: 89 }, // Salmos de Davi e outros (Simplificado)
    { livro: "Salmos", de: 91, ate: 150 },
    { livro: "1 Reis", de: 1, ate: 11 }, // Reinado de Salomão
    { livro: "2 Crônicas", de: 1, ate: 9 },
    { livro: "Provérbios", de: 1, ate: 31 },
    { livro: "Eclesiastes", de: 1, ate: 12 },
    { livro: "Cânticos", de: 1, ate: 8 },
    { livro: "1 Reis", de: 12, ate: 22 }, // Reino Dividido
    { livro: "2 Reis", de: 1, ate: 25 },
    { livro: "2 Crônicas", de: 10, ate: 36 },
    // Profetas Pré-Exílio e Exílio (Misturados com Reis, mas agrupados aqui para leitura fluida)
    { livro: "Isaías", de: 1, ate: 66 },
    { livro: "Oseias", de: 1, ate: 14 },
    { livro: "Joel", de: 1, ate: 3 },
    { livro: "Amós", de: 1, ate: 9 },
    { livro: "Obadias", de: 1, ate: 1 },
    { livro: "Jonas", de: 1, ate: 4 },
    { livro: "Miqueias", de: 1, ate: 7 },
    { livro: "Naum", de: 1, ate: 3 },
    { livro: "Habacuque", de: 1, ate: 3 },
    { livro: "Sofonias", de: 1, ate: 3 },
    { livro: "Jeremias", de: 1, ate: 52 },
    { livro: "Lamentações", de: 1, ate: 5 },
    { livro: "Ezequiel", de: 1, ate: 48 },
    { livro: "Daniel", de: 1, ate: 12 },
    // Pós-Exílio
    { livro: "Esdras", de: 1, ate: 10 },
    { livro: "Neemias", de: 1, ate: 13 },
    { livro: "Ester", de: 1, ate: 10 },
    { livro: "Ageu", de: 1, ate: 2 },
    { livro: "Zacarias", de: 1, ate: 14 },
    { livro: "Malaquias", de: 1, ate: 4 },
    // Novo Testamento
    { livro: "Mateus", de: 1, ate: 28 },
    { livro: "Marcos", de: 1, ate: 16 },
    { livro: "Lucas", de: 1, ate: 24 },
    { livro: "João", de: 1, ate: 21 },
    { livro: "Atos", de: 1, ate: 28 },
    // Cartas de Paulo e Outros (Inseridas aproximadamente na ordem histórica)
    { livro: "Tiago", de: 1, ate: 5 },
    { livro: "Gálatas", de: 1, ate: 6 },
    { livro: "1 Tessalonicenses", de: 1, ate: 5 },
    { livro: "2 Tessalonicenses", de: 1, ate: 3 },
    { livro: "1 Coríntios", de: 1, ate: 16 },
    { livro: "2 Coríntios", de: 1, ate: 13 },
    { livro: "Romanos", de: 1, ate: 16 },
    { livro: "Efésios", de: 1, ate: 6 },
    { livro: "Filipenses", de: 1, ate: 4 },
    { livro: "Colossenses", de: 1, ate: 4 },
    { livro: "Filemom", de: 1, ate: 1 },
    { livro: "1 Timóteo", de: 1, ate: 6 },
    { livro: "Tito", de: 1, ate: 3 },
    { livro: "1 Pedro", de: 1, ate: 5 },
    { livro: "2 Pedro", de: 1, ate: 3 },
    { livro: "2 Timóteo", de: 1, ate: 4 },
    { livro: "Hebreus", de: 1, ate: 13 },
    { livro: "Judas", de: 1, ate: 1 },
    { livro: "1 João", de: 1, ate: 5 },
    { livro: "2 João", de: 1, ate: 1 },
    { livro: "3 João", de: 1, ate: 1 },
    { livro: "Apocalipse", de: 1, ate: 22 }
];

// Gera a lista plana Cronológica
export const BIBLIA_CRONOLOGICA = [];
BLOCOS_CRONOLOGICOS.forEach(bloco => {
    for (let i = bloco.de; i <= bloco.ate; i++) {
        BIBLIA_CRONOLOGICA.push({ livro: bloco.livro, cap: i });
    }
});