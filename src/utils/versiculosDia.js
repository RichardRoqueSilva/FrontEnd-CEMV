// Lista de versículos chave para inspiração diária
export const VERSICULOS_DIA = [
    "Jeremias 29:11", "Salmos 23:1", "Filipenses 4:13", "João 3:16",
    "Romanos 8:28", "Isaías 41:10", "Salmos 46:1", "Mateus 11:28",
    "Josué 1:9", "Proverbios 3:5", "2 Coríntios 5:7", "Salmos 91:1",
    "Isaías 40:31", "Lamentações 3:22-23", "Hebreus 11:1", "Tiago 1:5",
    "1 Pedro 5:7", "Salmos 121:1-2", "Mateus 6:33", "Romanos 12:2",
    "1 Coríntios 13:4-7", "Gálatas 5:22-23", "Efésios 2:8", "Filipenses 4:6-7",
    "Colossenses 3:23", "1 Tessalonicenses 5:16-18", "2 Timóteo 1:7", "Salmos 27:1",
    "Salmos 37:4", "Provérbios 16:3", "Isaías 53:5"
];

// Função que descobre qual versículo é o de hoje
export const getVersiculoDoDia = () => {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), 0, 0);
    const diff = hoje - inicio;
    const umDia = 1000 * 60 * 60 * 24;
    const diaDoAno = Math.floor(diff / umDia);

    // Usa o operador % para garantir que, se a lista acabar, ela volta pro começo
    const indice = diaDoAno % VERSICULOS_DIA.length;
    
    return VERSICULOS_DIA[indice];
};