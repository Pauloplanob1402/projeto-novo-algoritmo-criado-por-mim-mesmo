import type { Question } from "@/types/question";

// Banco de 100 perguntas do UNSAY, com metadados usados pelo algoritmo de
// seleção (curiosity, comparison, contradiction, friendShare, depth) e pela
// segmentação de categoria/dimensão de perfil. Ver ETAPA 4 no briefing do
// produto para o racional do algoritmo.
export const QUESTIONS: Question[] = [
  {
    "id": 1,
    "text": "Você acha que é uma pessoa melhor do que a maioria?",
    "category": "identidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 6,
    "shareability": 5,
    "depth": 5,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 2,
    "text": "Se você pudesse ler a mente de uma pessoa por um dia, em quem pensaria primeiro?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 6,
    "shareability": 5,
    "depth": 8,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 3,
    "text": "Qual dessas coisas você teria mais dificuldade de admitir sobre si mesmo: que é medroso, que é egoísta ou que é invejoso?",
    "category": "identidade",
    "type": "choice",
    "options": [
      "Que é medroso",
      "Que é egoísta",
      "Que é invejoso"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 6,
    "comparison": 5,
    "shareability": 3,
    "depth": 6,
    "contradiction": 6,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 4,
    "text": "Você já desejou que um amigo muito próximo fracassasse em algo, só para não se sentir inferior?",
    "category": "relacionamentos",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 8,
    "comparison": 6,
    "shareability": 5,
    "depth": 9,
    "contradiction": 6,
    "friendShare": 6,
    "difficulty": 3
  },
  {
    "id": 5,
    "text": "Se ninguém nunca fosse descobrir, você trairia seu parceiro por uma noite com alguém que sempre desejou?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 8,
    "ego": 9,
    "comparison": 5,
    "shareability": 6,
    "depth": 8,
    "contradiction": 6,
    "friendShare": 5,
    "difficulty": 5
  },
  {
    "id": 6,
    "text": "Você acha que seus amigos têm uma vida melhor que a sua?",
    "category": "relacionamentos",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 6,
    "shareability": 4,
    "depth": 4,
    "contradiction": 2,
    "friendShare": 6,
    "difficulty": 3
  },
  {
    "id": 7,
    "text": "Qual dessas coisas te assusta mais: envelhecer sozinho, ser esquecido ou nunca ter feito o que queria?",
    "category": "medo",
    "type": "choice",
    "options": [
      "Envelhecer sozinho",
      "Ser esquecido",
      "Nunca ter feito o que queria"
    ],
    "dims": [
      "security"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 7,
    "shareability": 4,
    "depth": 4,
    "contradiction": 4,
    "friendShare": 3,
    "difficulty": 6
  },
  {
    "id": 8,
    "text": "Você contaria a seu melhor amigo que o parceiro dele está te dando em cima?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 4,
    "ego": 5,
    "comparison": 4,
    "shareability": 5,
    "depth": 5,
    "contradiction": 4,
    "friendShare": 9,
    "difficulty": 4
  },
  {
    "id": 9,
    "text": "Se pudesse apagar uma única lembrança da sua vida, qual seria?",
    "category": "dinheiro",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "money"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 6,
    "shareability": 3,
    "depth": 6,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 10,
    "text": "Você já se pegou fazendo algo que critica nos outros?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 4,
    "ego": 5,
    "comparison": 4,
    "shareability": 4,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 11,
    "text": "Em uma escala de 0 a 10, o quanto você confia em pessoas que acabou de conhecer?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 4,
    "ego": 4,
    "comparison": 5,
    "shareability": 3,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 12,
    "text": "Você prefere que seu parceiro veja todas as suas conversas de WhatsApp ou seu melhor amigo veja todo o seu histórico de buscas na internet?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 6,
    "shareability": 5,
    "depth": 4,
    "contradiction": 4,
    "friendShare": 9,
    "difficulty": 3
  },
  {
    "id": 13,
    "text": "Se você soubesse que seu melhor amigo está traindo, você contaria para a companheira dele?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 5,
    "ego": 7,
    "comparison": 5,
    "shareability": 4,
    "depth": 8,
    "contradiction": 6,
    "friendShare": 7,
    "difficulty": 3
  },
  {
    "id": 14,
    "text": "Você acha que merece mais do que tem hoje?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 6,
    "shareability": 3,
    "depth": 4,
    "contradiction": 3,
    "friendShare": 3,
    "difficulty": 4
  },
  {
    "id": 15,
    "text": "Qual dessas qualidades você acha que falta em você: coragem, disciplina ou empatia?",
    "category": "comportamento",
    "type": "choice",
    "options": [
      "Coragem",
      "Disciplina",
      "Empatia"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 9,
    "shareability": 5,
    "depth": 5,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 16,
    "text": "Você já se sentiu aliviado por não estar na situação difícil de outra pessoa?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 7,
    "comparison": 5,
    "shareability": 3,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 17,
    "text": "Se pudesse escolher a idade em que vai morrer, sem saber como, você escolheria?",
    "category": "futuro",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "freedom",
      "risk"
    ],
    "curiosity": 8,
    "ego": 8,
    "comparison": 5,
    "shareability": 5,
    "depth": 10,
    "contradiction": 5,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 18,
    "text": "Você já disse \"te amo\" para alguém sem sentir, só para não magoar?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 5,
    "comparison": 4,
    "shareability": 5,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 19,
    "text": "Você acha que a maioria das pessoas é mais feliz do que você?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 5,
    "comparison": 6,
    "shareability": 5,
    "depth": 5,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 20,
    "text": "Se você pudesse ter um superpoder, mas ele fosse usado apenas para benefício próprio, qual escolheria?",
    "category": "poder",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "status",
      "risk"
    ],
    "curiosity": 7,
    "ego": 5,
    "comparison": 5,
    "shareability": 8,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 6
  },
  {
    "id": 21,
    "text": "Você já evitou um amigo porque ele estava passando por um momento difícil e você não sabia o que dizer?",
    "category": "relacionamentos",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 5,
    "comparison": 6,
    "shareability": 5,
    "depth": 6,
    "contradiction": 4,
    "friendShare": 6,
    "difficulty": 3
  },
  {
    "id": 22,
    "text": "Qual dessas coisas você faria por R$1 milhão, desde que ninguém soubesse: abandonar um amigo, mentir para a família ou terminar um namoro?",
    "category": "amor",
    "type": "choice",
    "options": [
      "Abandonar um amigo",
      "Mentir para a família",
      "Terminar um namoro"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 9,
    "comparison": 7,
    "shareability": 4,
    "depth": 8,
    "contradiction": 8,
    "friendShare": 9,
    "difficulty": 5
  },
  {
    "id": 23,
    "text": "Você acredita que pessoas boas podem fazer coisas terríveis se estiverem com medo?",
    "category": "medo",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "security"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 8,
    "shareability": 3,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 24,
    "text": "Se você pudesse ouvir o que as pessoas realmente pensam de você, mas só uma vez, você ouviria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 4,
    "shareability": 4,
    "depth": 6,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 25,
    "text": "Você já se sentiu orgulhoso de algo que fez, mas não pode contar a ninguém?",
    "category": "identidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 6,
    "comparison": 5,
    "shareability": 3,
    "depth": 5,
    "contradiction": 3,
    "friendShare": 3,
    "difficulty": 3
  },
  {
    "id": 26,
    "text": "Em uma briga entre dois amigos, você costuma tentar apaziguar ou escolher um lado?",
    "category": "relacionamentos",
    "type": "choice",
    "options": [
      "Concordo",
      "Discordo"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 4,
    "ego": 3,
    "comparison": 6,
    "shareability": 3,
    "depth": 4,
    "contradiction": 4,
    "friendShare": 6,
    "difficulty": 3
  },
  {
    "id": 27,
    "text": "Você acha que sua família te entende de verdade?",
    "category": "familia",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships",
      "security"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 6,
    "shareability": 5,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 28,
    "text": "Qual dessas opções te define mais: você é movido por ambição, por medo ou por amor?",
    "category": "amor",
    "type": "choice",
    "options": [
      "Você é movido por ambição",
      "Por medo",
      "Por amor"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 5,
    "comparison": 6,
    "shareability": 3,
    "depth": 6,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 29,
    "text": "Você já desejou que seus pais tivessem sido diferentes?",
    "category": "familia",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships",
      "security"
    ],
    "curiosity": 7,
    "ego": 10,
    "comparison": 5,
    "shareability": 5,
    "depth": 10,
    "contradiction": 5,
    "friendShare": 3,
    "difficulty": 5
  },
  {
    "id": 30,
    "text": "Se você pudesse ter certeza de que algo que fez no passado foi a decisão certa, o que seria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 4,
    "shareability": 3,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 6
  },
  {
    "id": 31,
    "text": "Você já se sentiu uma fraude em alguma área da sua vida?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 7,
    "ego": 8,
    "comparison": 6,
    "shareability": 3,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 32,
    "text": "Você prefere ser elogiado pela sua aparência ou pela sua inteligência?",
    "category": "status",
    "type": "choice",
    "options": [
      "Concordo",
      "Discordo"
    ],
    "dims": [
      "status"
    ],
    "curiosity": 4,
    "ego": 3,
    "comparison": 4,
    "shareability": 3,
    "depth": 5,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 33,
    "text": "Se seus amigos fizessem uma lista dos seus defeitos, qual você acha que estaria no topo?",
    "category": "relacionamentos",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 5,
    "comparison": 7,
    "shareability": 3,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 7,
    "difficulty": 5
  },
  {
    "id": 34,
    "text": "Você já terminou um relacionamento por medo de se machucar mais tarde?",
    "category": "medo",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 6,
    "comparison": 4,
    "shareability": 4,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 35,
    "text": "Você acha que a felicidade é uma escolha ou uma consequência?",
    "category": "escolhas",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 7,
    "shareability": 4,
    "depth": 5,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 36,
    "text": "Você deixaria de fazer algo que ama se soubesse que isso desagrada alguém importante?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 5,
    "comparison": 6,
    "shareability": 3,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 37,
    "text": "Se você pudesse trocar de vida com alguém por uma semana, quem seria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 4,
    "shareability": 6,
    "depth": 8,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 38,
    "text": "Você já mentiu para parecer mais interessante?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 4,
    "ego": 6,
    "comparison": 5,
    "shareability": 3,
    "depth": 5,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 39,
    "text": "Em uma situação de perigo, você protegeria um estranho ou a si mesmo?",
    "category": "comportamento",
    "type": "choice",
    "options": [
      "Concordo",
      "Discordo"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 4,
    "ego": 5,
    "comparison": 6,
    "shareability": 3,
    "depth": 4,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 40,
    "text": "Você acha que a maioria das pessoas que você conhece te respeita de verdade?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 6,
    "shareability": 4,
    "depth": 4,
    "contradiction": 2,
    "friendShare": 3,
    "difficulty": 3
  },
  {
    "id": 41,
    "text": "Qual desses arrependimentos seria pior: não ter tentado algo ou ter tentado e fracassado?",
    "category": "identidade",
    "type": "choice",
    "options": [
      "Não ter tentado algo",
      "Ter tentado e fracassado"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 7,
    "comparison": 6,
    "shareability": 4,
    "depth": 7,
    "contradiction": 6,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 42,
    "text": "Você já pensou em trair, mas desistiu por medo das consequências?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 10,
    "comparison": 5,
    "shareability": 3,
    "depth": 7,
    "contradiction": 5,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 43,
    "text": "Se você pudesse ter um animal de estimação que falasse, mas que contasse todos os seus segredos para quem ele quisesse, você teria?",
    "category": "segredo",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 9,
    "ego": 8,
    "comparison": 6,
    "shareability": 6,
    "depth": 10,
    "contradiction": 5,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 44,
    "text": "Você acha que o dinheiro pode substituir a falta de amor?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 10,
    "shareability": 5,
    "depth": 4,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 45,
    "text": "Você já se sentiu sozinho mesmo estando rodeado de pessoas?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 4,
    "ego": 5,
    "comparison": 6,
    "shareability": 3,
    "depth": 7,
    "contradiction": 2,
    "friendShare": 3,
    "difficulty": 3
  },
  {
    "id": 46,
    "text": "Se você pudesse escolher a morte de uma pessoa para salvar outras cinco, você escolheria?",
    "category": "escolhas",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 8,
    "ego": 6,
    "comparison": 6,
    "shareability": 5,
    "depth": 8,
    "contradiction": 6,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 47,
    "text": "Você já se arrependeu de ter sido honesto com alguém?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 6,
    "ego": 7,
    "comparison": 6,
    "shareability": 5,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 48,
    "text": "Você se considera uma pessoa invejosa?",
    "category": "identidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 7,
    "comparison": 4,
    "shareability": 4,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 49,
    "text": "Se você pudesse assistir a um filme da sua vida, mas só até o momento atual, você assistiria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 5,
    "shareability": 6,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 50,
    "text": "Você já deixou de falar algo importante para não criar conflito?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 4,
    "ego": 5,
    "comparison": 6,
    "shareability": 3,
    "depth": 7,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 51,
    "text": "Qual dessas coisas você valoriza mais em um amigo: lealdade, humor ou inteligência?",
    "category": "relacionamentos",
    "type": "choice",
    "options": [
      "Lealdade",
      "Humor",
      "Inteligência"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 5,
    "ego": 3,
    "comparison": 6,
    "shareability": 4,
    "depth": 4,
    "contradiction": 3,
    "friendShare": 7,
    "difficulty": 6
  },
  {
    "id": 52,
    "text": "Você acha que seus pais se orgulham de você?",
    "category": "familia",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships",
      "security"
    ],
    "curiosity": 6,
    "ego": 6,
    "comparison": 8,
    "shareability": 5,
    "depth": 6,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 53,
    "text": "Se você pudesse apagar uma rede social da existência, qual seria?",
    "category": "dinheiro",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "money"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 4,
    "shareability": 4,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 54,
    "text": "Você já se sentiu culpado por algo que fez, mas não conseguiu se desculpar?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 5,
    "ego": 9,
    "comparison": 5,
    "shareability": 5,
    "depth": 7,
    "contradiction": 6,
    "friendShare": 3,
    "difficulty": 3
  },
  {
    "id": 55,
    "text": "Você preferiria ser esquecido por todos imediatamente ou lembrado por algo que você não fez?",
    "category": "escolhas",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 5,
    "comparison": 5,
    "shareability": 5,
    "depth": 5,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 56,
    "text": "Você acha que a maioria das pessoas é capaz de matar em legítima defesa?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 8,
    "ego": 7,
    "comparison": 7,
    "shareability": 3,
    "depth": 6,
    "contradiction": 5,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 57,
    "text": "Se você pudesse ter a certeza de que algo que acredita está errado, você gostaria de saber?",
    "category": "moralidade",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 6,
    "shareability": 4,
    "depth": 8,
    "contradiction": 4,
    "friendShare": 3,
    "difficulty": 6
  },
  {
    "id": 58,
    "text": "Você já se sentiu mais conectado com um amigo do que com sua família?",
    "category": "familia",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 4,
    "ego": 6,
    "comparison": 4,
    "shareability": 5,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 5,
    "difficulty": 4
  },
  {
    "id": 59,
    "text": "Em uma festa, você prefere ser o centro das atenções ou ficar na sua?",
    "category": "status",
    "type": "choice",
    "options": [
      "Concordo",
      "Discordo"
    ],
    "dims": [
      "status"
    ],
    "curiosity": 6,
    "ego": 5,
    "comparison": 4,
    "shareability": 4,
    "depth": 4,
    "contradiction": 2,
    "friendShare": 3,
    "difficulty": 4
  },
  {
    "id": 60,
    "text": "Você já fez algo que considerava errado, mas que, olhando para trás, faria de novo?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 4,
    "ego": 6,
    "comparison": 4,
    "shareability": 5,
    "depth": 5,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 61,
    "text": "Você acha que a beleza abre portas que o esforço não abre?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 8,
    "shareability": 5,
    "depth": 4,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 62,
    "text": "Se você pudesse ter uma conversa de 10 minutos com qualquer pessoa viva ou morta, quem seria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 4,
    "shareability": 8,
    "depth": 7,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 63,
    "text": "Você já traiu a confiança de alguém para proteger outra pessoa?",
    "category": "amor",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 5,
    "ego": 9,
    "comparison": 4,
    "shareability": 5,
    "depth": 7,
    "contradiction": 5,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 64,
    "text": "Você acredita que as pessoas mudam de verdade depois dos 30?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 3,
    "comparison": 7,
    "shareability": 4,
    "depth": 5,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 65,
    "text": "Qual dessas coisas você acha mais difícil: pedir desculpas ou perdoar?",
    "category": "moralidade",
    "type": "choice",
    "options": [
      "Pedir desculpas",
      "Perdoar"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 8,
    "ego": 3,
    "comparison": 8,
    "shareability": 4,
    "depth": 5,
    "contradiction": 2,
    "friendShare": 3,
    "difficulty": 5
  },
  {
    "id": 66,
    "text": "Você já se sentiu inferior ao lado de alguém que você gosta?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 10,
    "comparison": 5,
    "shareability": 5,
    "depth": 9,
    "contradiction": 5,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 67,
    "text": "Se você pudesse ter um poder de influenciar as decisões de outras pessoas, você usaria?",
    "category": "poder",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "status",
      "risk"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 6,
    "shareability": 4,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 68,
    "text": "Você já desejou que alguém próximo desaparecesse da sua vida?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 10,
    "comparison": 5,
    "shareability": 4,
    "depth": 9,
    "contradiction": 6,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 69,
    "text": "Você acha que seus amigos te conhecem melhor do que sua família?",
    "category": "familia",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 7,
    "shareability": 3,
    "depth": 8,
    "contradiction": 3,
    "friendShare": 5,
    "difficulty": 5
  },
  {
    "id": 70,
    "text": "Se você soubesse que morreria em 24 horas, passaria com quem e fazendo o quê?",
    "category": "futuro",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "freedom",
      "risk"
    ],
    "curiosity": 7,
    "ego": 8,
    "comparison": 6,
    "shareability": 5,
    "depth": 8,
    "contradiction": 6,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 71,
    "text": "Você já se sentiu aliviado por uma traição que não foi descoberta?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 5,
    "comparison": 6,
    "shareability": 4,
    "depth": 7,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 72,
    "text": "Você prefere ser amado pelo que você é ou pelo que você pode se tornar?",
    "category": "amor",
    "type": "choice",
    "options": [
      "Concordo",
      "Discordo"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 6,
    "shareability": 4,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 3,
    "difficulty": 4
  },
  {
    "id": 73,
    "text": "Se você pudesse escolher uma memória para viver para sempre, qual seria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 4,
    "comparison": 6,
    "shareability": 3,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 74,
    "text": "Você já julgou alguém por algo que você mesmo faz?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "status"
    ],
    "curiosity": 6,
    "ego": 7,
    "comparison": 4,
    "shareability": 5,
    "depth": 7,
    "contradiction": 3,
    "friendShare": 3,
    "difficulty": 5
  },
  {
    "id": 75,
    "text": "Se você pudesse ter certeza de que seu parceiro nunca te trairia, você ainda sentiria ciúmes?",
    "category": "amor",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 7,
    "ego": 8,
    "comparison": 5,
    "shareability": 6,
    "depth": 9,
    "contradiction": 6,
    "friendShare": 6,
    "difficulty": 6
  },
  {
    "id": 76,
    "text": "Você acha que a maioria das pessoas que você segue nas redes sociais tem uma vida mais interessante que a sua?",
    "category": "status",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "status"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 7,
    "shareability": 4,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 77,
    "text": "Qual desses você sentiria mais falta: dinheiro, liberdade ou tempo?",
    "category": "dinheiro",
    "type": "choice",
    "options": [
      "Dinheiro",
      "Liberdade",
      "Tempo"
    ],
    "dims": [
      "money"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 9,
    "shareability": 3,
    "depth": 5,
    "contradiction": 8,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 78,
    "text": "Você já se arrependeu de não ter dito algo a alguém que já morreu?",
    "category": "identidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 6,
    "comparison": 4,
    "shareability": 3,
    "depth": 7,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 79,
    "text": "Se você pudesse saber como as pessoas te veem, você gostaria?",
    "category": "comportamento",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 3,
    "comparison": 4,
    "shareability": 3,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 80,
    "text": "Você já se sentiu pressionado a ser bem-sucedido pela sua família?",
    "category": "familia",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships",
      "security"
    ],
    "curiosity": 5,
    "ego": 8,
    "comparison": 6,
    "shareability": 3,
    "depth": 9,
    "contradiction": 4,
    "friendShare": 3,
    "difficulty": 4
  },
  {
    "id": 81,
    "text": "Em uma relação, você prefere ter razão ou ser feliz?",
    "category": "relacionamentos",
    "type": "choice",
    "options": [
      "Concordo",
      "Discordo"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 5,
    "ego": 3,
    "comparison": 4,
    "shareability": 5,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 82,
    "text": "Você já deixou de ajudar alguém por preguiça ou indiferença?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 4,
    "ego": 5,
    "comparison": 6,
    "shareability": 5,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 3
  },
  {
    "id": 83,
    "text": "Se você pudesse ter um dia perfeito repetido todos os dias, você aceitaria?",
    "category": "futuro",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "freedom",
      "risk"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 4,
    "shareability": 7,
    "depth": 8,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 84,
    "text": "Você acha que seus medos são mais racionais ou irracionais?",
    "category": "medo",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "security"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 8,
    "shareability": 5,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 85,
    "text": "Se você pudesse ter a resposta para uma única pergunta sobre o futuro, qual seria?",
    "category": "futuro",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "freedom",
      "risk"
    ],
    "curiosity": 5,
    "ego": 5,
    "comparison": 5,
    "shareability": 4,
    "depth": 7,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 86,
    "text": "Você já se sentiu mais próximo de um ex do que de seu atual?",
    "category": "relacionamentos",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 6,
    "comparison": 6,
    "shareability": 3,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 87,
    "text": "Você acha que a lealdade é mais importante que a honestidade?",
    "category": "moralidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 7,
    "shareability": 4,
    "depth": 5,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 88,
    "text": "Se você pudesse escolher entre nunca mais se sentir triste ou nunca mais se sentir com raiva, qual escolheria?",
    "category": "escolhas",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 3,
    "comparison": 5,
    "shareability": 5,
    "depth": 6,
    "contradiction": 4,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 89,
    "text": "Você já fez algo por dinheiro que violou seus princípios?",
    "category": "dinheiro",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "money"
    ],
    "curiosity": 5,
    "ego": 6,
    "comparison": 7,
    "shareability": 5,
    "depth": 6,
    "contradiction": 5,
    "friendShare": 2,
    "difficulty": 3
  },
  {
    "id": 90,
    "text": "Você acha que seus amigos te valorizam tanto quanto você os valoriza?",
    "category": "relacionamentos",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 8,
    "shareability": 5,
    "depth": 4,
    "contradiction": 4,
    "friendShare": 6,
    "difficulty": 4
  },
  {
    "id": 91,
    "text": "Se você pudesse ter um talento extraordinário, mas isso te isolasse das outras pessoas, você aceitaria?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 4,
    "comparison": 5,
    "shareability": 7,
    "depth": 7,
    "contradiction": 4,
    "friendShare": 4,
    "difficulty": 6
  },
  {
    "id": 92,
    "text": "Você já se sentiu injustiçado por alguém que você ajudou?",
    "category": "identidade",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 7,
    "ego": 10,
    "comparison": 4,
    "shareability": 4,
    "depth": 7,
    "contradiction": 5,
    "friendShare": 3,
    "difficulty": 4
  },
  {
    "id": 93,
    "text": "Se você pudesse mudar uma coisa na sua personalidade, o que seria?",
    "category": "identidade",
    "type": "open",
    "options": [
      "Sim, sem dúvida",
      "Não saberia dizer"
    ],
    "dims": [
      "status"
    ],
    "curiosity": 5,
    "ego": 4,
    "comparison": 5,
    "shareability": 5,
    "depth": 8,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 94,
    "text": "Você acha que a maioria das pessoas é boa no fundo, mesmo que faça coisas ruins?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 3,
    "comparison": 8,
    "shareability": 5,
    "depth": 4,
    "contradiction": 3,
    "friendShare": 4,
    "difficulty": 5
  },
  {
    "id": 95,
    "text": "Você já se perguntou se realmente ama alguém ou só está acostumado?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 6,
    "ego": 5,
    "comparison": 4,
    "shareability": 5,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 3,
    "difficulty": 3
  },
  {
    "id": 96,
    "text": "Se você pudesse ter certeza de que nada do que você faz importa, você continuaria fazendo?",
    "category": "comportamento",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 4,
    "comparison": 5,
    "shareability": 4,
    "depth": 6,
    "contradiction": 3,
    "friendShare": 3,
    "difficulty": 5
  },
  {
    "id": 97,
    "text": "Você já escondeu um segredo seu com medo do julgamento dos outros?",
    "category": "medo",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "security"
    ],
    "curiosity": 6,
    "ego": 9,
    "comparison": 5,
    "shareability": 4,
    "depth": 7,
    "contradiction": 5,
    "friendShare": 2,
    "difficulty": 5
  },
  {
    "id": 98,
    "text": "Qual desses você considera mais traiçoeiro: mentir, omitir ou fingir?",
    "category": "moralidade",
    "type": "choice",
    "options": [
      "Mentir",
      "Omitir",
      "Fingir"
    ],
    "dims": [
      "moral"
    ],
    "curiosity": 7,
    "ego": 3,
    "comparison": 6,
    "shareability": 3,
    "depth": 6,
    "contradiction": 2,
    "friendShare": 4,
    "difficulty": 4
  },
  {
    "id": 99,
    "text": "Se você pudesse recomeçar sua vida do zero, mas sem as pessoas que você ama, você faria?",
    "category": "futuro",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "risk"
    ],
    "curiosity": 5,
    "ego": 3,
    "comparison": 4,
    "shareability": 3,
    "depth": 8,
    "contradiction": 2,
    "friendShare": 2,
    "difficulty": 4
  },
  {
    "id": 100,
    "text": "Você acha que a pessoa que você é hoje é a mesma que seus amigos conhecem?",
    "category": "relacionamentos",
    "type": "binary",
    "options": [
      "SIM",
      "NÃO"
    ],
    "dims": [
      "relationships"
    ],
    "curiosity": 6,
    "ego": 5,
    "comparison": 6,
    "shareability": 5,
    "depth": 4,
    "contradiction": 3,
    "friendShare": 7,
    "difficulty": 4
  }
];
