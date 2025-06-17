DRONE AGRÍCOLA
Visão Geral do Projeto
AgroDrone: O Legado da Colheita é um simulador estratégico e de gerenciamento de tempo que imerge o jogador no desafiador universo da agricultura moderna. Combinando elementos de ação rápida com decisões táticas, o jogo propõe a intersecção crucial entre a resiliência do campo e a inovação tecnológica urbana. O jogador assume o papel de um piloto de drone agrícola de ponta, encarregado de proteger as colheitas da dedicada fazendeira Dona Benta contra uma miríade de ameaças, enquanto o brilhante Dr. Urbano, da cidade, fornece o suporte tecnológico. A narrativa central se desdobra em torno da importância da harmonia entre o meio rural e o avanço científico para garantir a segurança alimentar e a prosperidade mútua.

Conceito e Mecânicas Principais
O cerne de AgroDrone reside na identificação e resolução de problemas agrícolas urgentes através de uma série de minigames dinâmicos. O jogo principal envolve a patrulha aérea de uma vasta plantação, onde ícones indicam o surgimento de desafios iminentes. A detecção e interação com esses problemas transportam o jogador para minigames específicos, cada um com mecânicas únicas que testam reflexos, precisão e estratégia.

Minigames Detalhados:
Minigame da Praga (Pulverização Tática):

Mecânica Central: Simulação de pulverização aérea de uma área infestada. O jogador controla um "spray" via arrasto do mouse para cobrir uma porcentagem crítica da área da praga, representada por uma grade de células.
Desafios Avançados: Pragas podem ser "Estacionárias", "Espalhando" (aumentando seu tamanho e dificultando a erradicação), ou "Móveis" (exigindo rastreamento e antecipação). A gestão do tanque de pulverização (recurso limitado) adiciona uma camada estratégica, penalizando o desperdício.
Elementos de Complexidade: O sistema utiliza um mapaPulverizacao off-screen para renderizar a área tratada e uma pragaGrid 2D para calcular com precisão a área pulverizada, exigindo que uma porcentagem mínima (80%) seja alcançada para o sucesso. Partículas visuais de spray enriquecem a experiência.
Minigame da Seca (Ritmo e Precisão):

Mecânica Central: Baseado em ritmo e reflexos, o jogador deve apertar a barra de espaço no momento exato em que uma barraAguaY em movimento se alinha com uma zonaAlvoAguaY.
Desafios Avançados: A velocidadeBarraAgua aumenta progressivamente com acertos, e a zonaAlvoTipo pode variar para "fixa", "móvel" ou "aleatória", exigindo adaptação. Falhas consecutivas ou a regressão total do plantaEstagioFlor (de murcha a flor completa, com 5 estágios) levam ao insucesso.
Elementos de Complexidade: Um sistema de falhasConsecutivasSeca e plantaEstagioFlor implementa um feedback direto sobre o desempenho do jogador, além de um efeito visual de irrigação e feedback de texto.
Minigame da Colheita (Gerenciamento de Recursos e Destreza):

Mecânica Central: O jogador controla uma Colheitadeira (agora uma entidade distinta com seus próprios movimentos e animações de roda) para coletar graosNaPlantacao. A barra de espaço ativa/desativa a hasteColheitaAtiva para coletar os grãos.
Desafios Avançados: Diferentes tipos de grãos (normal, ouro, podre, pedra) oferecem pontos variados (positivos ou negativos). Há uma capacidadeAtualArmazem limitada, exigindo gerenciamento do que e quando colher. Grãos "pedra" têm uma chance (DANO_PEDRA_HASTE) de danificar a haste, exigindo um tempo de HASTE_TEMPO_REPARO.
Elementos de Complexidade: O jogo incorpora elementos de "push your luck" com os grãos de pedra e uma mecânica de reparo da haste, adicionando uma camada de risco e recompensa. A necessidade de esvaziar o armazém antes de continuar a colheita é um diferencial.
Minigame da Doença (Detecção e Pulverização Limitada):

Mecânica Central: O jogador deve manobrar o drone para "pulverizar" focosRestantesDoenca espalhados pelo mapa, utilizando um número limitado de dosesAntidoto.
Desafios Avançados: Focos podem ser "movimentados", exigindo que o jogador os persiga. Uma névoa (nevoaAlpha) pode dificultar a visibilidade, pulsando e aumentando a opacidade. Focos não tratados causam FOCO_DANO_POR_SEGUNDO à saúde da fazenda.
Elementos de Complexidade: A limitação de doses adiciona um elemento de escassez e precisão. A progressão da névoa e o movimento dos focos aumentam a dificuldade visual e de controle.
Elementos de Game Design e UI/UX
Ciclo de Jogo Principal: Gerenciamento do tempoRestante e da saudeFazenda. Problemas são gerados periodicamente (PROBLEMA_TEMPO_GERACAO), e a fazenda sofre TAXA_DETERIORACAO_PROBLEMA por cada problema não resolvido, criando um senso de urgência constante.
Narrativa e Imersão: Uma historiaTextos detalhada, apresentada em cenas (campoCidade, donaBenta, drUrbano, etc.), estabelece o contexto do jogo e a importância da missão, culminando na "harmonia entre Campo e Cidade".
UI/UX Refinada:
Status do Jogo: Exibição clara de score, tempoRestante e saudeFazenda com uma barra de vida visualmente representativa (uiHealthBarWidth, uiHealthBarHeight) que muda de cor (lerpColor) de verde para vermelho, indicando o estado crítico.
Feedback Temporal: Um sistema de feedbackText com feedbackTimer e cores personalizáveis fornece mensagens instantâneas ao jogador sobre suas ações (e.g., "PERFEITO!", "ERRO!").
Animações Detalhadas: O Drone possui animações de inclinação (inclinacao) e rotação de hélice (rotacaoHelice), enquanto a Colheitadeira tem rodas que giram (rotacaoRoda). Os próprios Problemas possuem uma "pulsação de urgência" com opacidade e tamanho variáveis.
Estrutura de Classes e Organização do Código
O projeto é modularizado através de classes bem definidas, encapsulando o comportamento e a aparência de cada entidade do jogo:

Drone: Representa a unidade de controle do jogador, com lógica de movimento, restrição de tela e animações visuais.
Colheitadeira (NOVO): Uma classe dedicada para o veículo do minigame de colheita, com sua própria movimentação e estética.
Planta: Elementos de cenário que representam as plantações, com potencial para atributos de saúde futuros.
Problema: Classe abstrata para os desafios do jogo, responsável por seu display visual (com indicadores de urgência) e detecção de interação com o drone. Atua como um "gatilho" para os minigames.
Grao (NOVO): Representa os diferentes tipos de grãos no minigame de colheita, com características e pontuações variadas.
Particle e ParticleSystem: Um sistema genérico de partículas para efeitos visuais, como o spray de agrotóxico, adicionando dinamismo visual.
Créditos (Concepção e Desenvolvimento)
Visão Geral e Design de Jogo: Inspirado na interdependência entre agricultura e tecnologia, com o objetivo de criar uma experiência lúdica e educativa sobre os desafios do campo. Aprofundamento das mecânicas de minigames para oferecer diversidade e complexidade.
Estrutura e Arquitetura do Código: Implementação modular baseada em classes (Drone, Problema, Planta, Colheitadeira, Grao, Particle, ParticleSystem) para organização, escalabilidade e manutenção. Uso de variáveis globais categorizadas para fácil acesso e controle do estado do jogo.
Minigame da Praga (Pulverização): Design da mecânica de grade (pragaGrid) para cálculo de pulverização e implementação de tipos de praga dinâmicos (estacionaria, espalhando, movel). Gestão de recursos (tanquePulverizacao) e efeitos visuais de spray.
Minigame da Seca (Ritmo): Desenvolvimento da barra de ritmo com dificuldade progressiva e múltiplos tipos de zona alvo (fixa, movel, aleatoria). Feedback visual do plantaEstagioFlor e sistema de falhasConsecutivasSeca.
Minigame da Colheita: Redesenho completo da mecânica para incluir a Colheitadeira como entidade controlável, variedade de grãos com diferentes pontuações e penalidades, e o conceito de hasteQuebrada com tempo de reparo, adicionando risco estratégico.
Minigame da Doença: Concepção de focos móveis, sistema de doses limitadas de dosesAntidoto e o efeito de névoa (nevoaAlpha) que pulsa e dificulta a visibilidade, aumentando a pressão sobre o jogador.
Sistema de História e UI/UX: Criação da narrativa sequencial (historiaTextos) para ambientação do jogador. Design da interface de usuário (exibirStatusJogo, mostrarFeedback) para fornecer informações claras e feedback imediato, melhorando a experiência do jogador.
Refinamentos Visuais e Animações: Adição de detalhes gráficos e animações (inclinação do drone, rotação de hélices e rodas da colheitadeira, pulsação dos problemas e da névoa de doença) para maior imersão e polimento estético.
