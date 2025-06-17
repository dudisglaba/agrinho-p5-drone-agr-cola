// ===============================================
// Variáveis Globais (Mantidas e Aprimoradas)
// ===============================================
let drone;
let plantas = [];
let problemas = []; // Array para armazenar os problemas (praga, seca, colheita, doenca)
let estadoJogo = 'iniciar'; // 'iniciar', 'comoJogar', 'historia', 'jogando', 'minigamePraga', 'minigameSeca', 'minigameColheita', 'minigameDoenca', 'fim'
let score = 0;
let tempoRestante = 90; // Tempo inicial do jogo em segundos
let saudeFazenda = 100; // Saúde geral da fazenda
const PROBLEMA_TEMPO_GERACAO = 10; // Tempo em segundos para gerar um novo problema (MELHORADO: Nome da constante)
let ultimoProblemaGerado = 0;
const MAX_PROBLEMAS_ATIVOS = 5; // Limite de problemas ativos na tela (MELHORADO: Nome da constante)
const TAXA_DETERIORACAO_PROBLEMA = 0.5; // Quanto de saúde a fazenda perde por segundo por problema (MELHORADO: Nome da constante)
let problemaAtual = null; // Referência ao problema que iniciou o minigame

// ===============================================
// Variáveis da História (mantido do seu código)
// ===============================================
let historiaIndex = 0;
let historiaTextos = [
    { scene: "campoCidade", text: "Em um mundo onde o campo e a cidade dependem um do outro..." },
    { scene: "donaBenta", text: "Dona Benta, uma fazendeira dedicada, enfrenta desafios em sua plantação." },
    { scene: "drUrbano", text: "Enquanto isso, na cidade, Dr. Urbano, um cientista brilhante, busca inovações." },
    { scene: "conexoes", text: "A conexão entre a produção agrícola e a tecnologia urbana é vital." },
    { scene: "problemasCampo", text: "Pragas, secas, e doenças ameaçam a colheita, deixando Dona Benta preocupada." },
    { scene: "problemasCidade", text: "Dr. Urbano tem uma ideia: um drone agrícola de última geração!" },
    { scene: "drone", text: "Este drone é a solução para monitorar e tratar as plantações rapidamente." },
    { scene: "donaBentaDrone", text: "Dona Benta, maravilhada, vê a esperança de dias melhores." },
    { scene: "drUrbanoDrone", text: "Dr. Urbano confia em suas habilidades para pilotar e salvar as colheitas." },
    { scene: "missao", text: "Sua missão é pilotar este drone, patrulhar os campos e resolver os problemas!" },
    { scene: "harmonia", text: "Garanta a colheita, e fortaleça o elo entre o campo e a cidade!" },
    { scene: "fimHistoria", text: "O futuro da nossa alimentação e da harmonia entre Campo e Cidade está em suas mãos... ou melhor, em suas asas!" }
];

// ===============================================
// Variáveis Minigame Praga (Pulverização - MELHORADO)
// ===============================================
let mapaPulverizacao; // Um gráfico off-screen para desenhar a área pulverizada
let areaAlvoPragaX, areaAlvoPragaY, areaAlvoPragaLargura, areaAlvoPragaAltura;
let pragaGrid; // NOVO: Array 2D para representar a área pulverizada
let gridCols, gridRows;
const PRAGA_GRID_SIZE = 20; // NOVO: Tamanho de cada célula da grade
let pragaEliminadaThreshold = 0.8; // NOVO: 80% da área precisa ser pulverizada
let pixelsPulverizados = 0; // Agora representa 'células pulverizadas'
let totalPixelsAlvo = 0; // Agora representa 'total de células alvo'
let tanquePulverizacao = 100; // Começa com 100%
const GASTO_POR_SPRAY = 0.5; // Custo de spray por "pixel" ou por arrasto
let pragaEliminadaEfeito = false;
let minigamePragaTimeoutId; // Para controlar o tempo do minigame de praga
const TEMPO_MINIGAME_PRAGA = 15; // Segundos para completar o minigame
let minigamePragaStartTime;
let pragaTipo = 'estacionaria'; // 'estacionaria', 'espalhando', 'movel'
let pragaCurrentX, pragaCurrentY;
let pragaMoveDirectionX = 1;
let pragaMoveDirectionY = 1;
const PRAGA_MOVE_SPEED = 1.5;
let pragaEspalhandoTimer = 0;
const PRAGA_ESPALHANDO_INTERVAL = 2000; // A cada 2 segundos a praga "espalha"
const PRAGA_ESPALHANDO_RAIO = 50; // Raio de espalhamento da praga
let pragaTamanhoBase = 100; // NOVO: Tamanho base da praga
let pragaAlvoImage; // Imagem da praga para desenho
let pragaCorpoAlpha = 255; // Opacidade da praga para efeito de desaparecimento

// ===============================================
// Variáveis Minigame Seca (Ritmo - MELHORADO)
// ===============================================
let barraAguaY;
let barraAguaDirecao = 1;
let velocidadeBarraAgua = 5;
let zonaAlvoAguaY;
let zonaAlvoAguaAltura = 120;
let acertosSeca = 0;
let falhasConsecutivasSeca = 0;
let plantaEstagioFlor = 0; // 0 = murcha, 1 = broto, 2 = pequena, 3 = média, 4 = grande, 5 = flor completa
const MAX_ESTAGIOS_FLOR = 5; // Número máximo de estágios da flor
let irrigacaoEfeitoTimer = 0;
let minigameSecaTimeoutId;
const TEMPO_MINIGAME_SECA = 15;
let zonaAlvoTipo = 'fixa'; // 'fixa', 'movel', 'aleatoria' (NOVO: tipo aleatória)
let zonaAlvoAguaVelocidade = 1;
let zonaAlvoAguaDirecao = 1;

// ===============================================
// Variáveis Minigame Colheita (REFORMULADO)
// ===============================================
let colheitadeira; // Nova variável para a colheitadeira
let capacidadeAtualArmazem = 0;
const CAPACIDADE_MAXIMA_ARMAZEM = 10; // Capacidade para 10 grãos
let graosNaPlantacao = []; // Grãos agora ficam na plantação
let hasteQuebrada = false;
const HASTE_TEMPO_REPARO = 3; // Tempo em segundos para reparar a haste
let hasteReparoTimer = 0; // Contador para o reparo
let minigameColheitaTimeoutId;
const TEMPO_MINIGAME_COLHEITA = 20; // Segundos para o minigame de colheita
let colheitaEfeitoTimer = 0;
let armazemX, armazemY, armazemLargura, armazemAltura; // Posição e tamanho do armazém
const PONTOS_GRAO_NORMAL = 5;
const PONTOS_GRAO_OURO = 15;
const PENALIDADE_GRAO_PODRE = 5;
const PENALIDADE_GRAO_PEDRA = 10;
const DANO_PEDRA_HASTE = 30; // Chance de danificar a haste (em porcentagem)
const HASTE_COMPRIMENTO = 60; // Comprimento da haste de colheita
const HASTE_LARGURA = 100; // Largura da haste de colheita para capturar grãos
let hasteColheitaAtiva = false; // Estado da haste (ativada/desativada)

// ===============================================
// Variáveis Minigame Doença (MELHORADO)
// ===============================================
let focosRestantesDoenca = []; // Cada foco é um objeto { x, y, tamanho, tratado, tipo, pulseOffset }
let dosesAntidoto;
const DOSES_INICIAIS_ANTIDOTO = 8; // Doses limitadas para o antidoto
const DOSES_POR_FOCO = 1; // Quantas doses gasta por foco tratado
let minigameDoencaTimeoutId;
const TEMPO_MINIGAME_DOENCA = 20; // Segundos para completar o minigame
let doencaEliminadaEfeito = false;
let focosMovendo = true; // Focos podem se mover
let focoMoveSpeed = 1.5;
// focoMoveDirectionX e Y agora são atributos de cada foco
const FOCO_DANO_POR_SEGUNDO = 0.8; // Dano à fazenda se os focos não forem tratados
let nevoaAlpha = 0; // Opacidade da névoa
let nevoaDirection = 1; // Direção da pulsação da névoa
const NEVOA_PULSE_SPEED = 0.5; // Velocidade da pulsação da névoa
const NEVOA_MAX_ALPHA = 150; // Opacidade máxima da névoa

// ===============================================
// Variáveis de UI/UX (NOVO)
// ===============================================
let feedbackText = ""; // Texto temporário para feedback
let feedbackTimer = 0;
const FEEDBACK_DURATION = 1500; // Duração do feedback em milissegundos
let uiHealthBarWidth = 200; // Largura da barra de saúde
let uiHealthBarHeight = 20; // Altura da barra de saúde

// ===============================================
// Sistema de partículas para o spray (mantido)
// ===============================================
let sprayParticleSystem;

// ===============================================
// Funções Preload, Setup, Draw (Aprimoradas)
// ===============================================

function preload() {
    // Você pode carregar imagens de pragas, plantas, etc. aqui
    // Ex: pragaAlvoImage = loadImage('assets/praga.png');
}

function setup() {
    createCanvas(1100, 900);
    drone = new Drone(width / 2, height / 2);

    for (let i = 0; i < 50; i++) {
        plantas.push(new Planta(random(width), random(height)));
    }

    mapaPulverizacao = createGraphics(width, height);
    mapaPulverizacao.noStroke(); // Não queremos bordas nos "sprays"

    ultimoProblemaGerado = millis();
    textAlign(CENTER, CENTER); // Ajusta alinhamento padrão para facilitar o texto centralizado

    sprayParticleSystem = new ParticleSystem();

    // Cria a imagem da praga (desenho simples) - MELHORADO: Usa `createGraphics` para otimizar
    pragaAlvoImage = createGraphics(pragaTamanhoBase, pragaTamanhoBase);
    pragaAlvoImage.fill(139, 69, 19); // Corpo marrom escuro
    pragaAlvoImage.ellipse(pragaTamanhoBase / 2, pragaTamanhoBase / 2, pragaTamanhoBase * 0.8, pragaTamanhoBase * 0.6);
    pragaAlvoImage.fill(0); // Olhos
    pragaAlvoImage.ellipse(pragaTamanhoBase * 0.4, pragaTamanhoBase * 0.4, pragaTamanhoBase * 0.1);
    pragaAlvoImage.ellipse(pragaTamanhoBase * 0.6, pragaTamanhoBase * 0.4, pragaTamanhoBase * 0.1);
    // Antenas
    pragaAlvoImage.stroke(0);
    pragaAlvoImage.strokeWeight(2);
    pragaAlvoImage.line(pragaTamanhoBase * 0.4, pragaTamanhoBase * 0.35, pragaTamanhoBase * 0.3, pragaTamanhoBase * 0.2);
    pragaAlvoImage.line(pragaTamanhoBase * 0.6, pragaTamanhoBase * 0.35, pragaTamanhoBase * 0.7, pragaTamanhoBase * 0.2);
    pragaAlvoImage.noStroke(); // Garante que não haverá stroke padrão depois.

    // NOVO: Inicializa a posição do armazém para o minigame de colheita
    armazemX = width / 2;
    armazemY = height * 0.85;
    armazemLargura = 150;
    armazemAltura = 80;

    // Inicializa a colheitadeira para o minigame de colheita
    colheitadeira = new Colheitadeira(width / 2, height / 2);
}

function draw() {
    background(100, 150, 100);

    // NOVO: Executa o sistema de partículas globalmente (se houver partículas ativas)
    sprayParticleSystem.run(); // Pode ser otimizado para rodar apenas no minigame praga

    if (estadoJogo === 'iniciar') {
        mostrarTelaInicial();
    } else if (estadoJogo === 'comoJogar') {
        mostrarTelaComoJogar();
    } else if (estadoJogo === 'historia') {
        mostrarHistoria();
    } else if (estadoJogo === 'jogando') {
        executarJogoPrincipal();
    } else if (estadoJogo === 'minigamePraga') {
        executarMinigamePraga();
    } else if (estadoJogo === 'minigameSeca') {
        executarMinigameSeca();
    } else if (estadoJogo === 'minigameColheita') {
        executarMinigameColheita();
    } else if (estadoJogo === 'minigameDoenca') {
        executarMinigameDoenca();
    } else if (estadoJogo === 'fim') {
        mostrarTelaFim();
    }

    // NOVO: Desenha feedback de texto temporário
    if (feedbackTimer > 0) {
        push();
        fill(255, 200, 0, map(feedbackTimer, FEEDBACK_DURATION, 0, 255, 0));
        textSize(32);
        text(feedbackText, width / 2, height / 2);
        feedbackTimer -= deltaTime;
        pop();
    }
}

// ===============================================
// Funções de Interação (KeyPressed, MousePressed, MouseDragged - Aprimoradas)
// ===============================================

function keyPressed() {
    if (estadoJogo === 'iniciar') {
        if (key === 'Enter') {
            estadoJogo = 'historia';
            historiaIndex = 0;
        } else if (key === 'c' || key === 'C') {
            estadoJogo = 'comoJogar';
        }
    } else if (estadoJogo === 'comoJogar' && (key === 'Escape' || key === 'Backspace')) {
        estadoJogo = 'iniciar';
    } else if (estadoJogo === 'historia') {
        if (key === 'Enter' || key === ' ') {
            avancarHistoria();
        }
    } else if (estadoJogo === 'fim' && key === 'r') {
        reiniciarJogo();
    }
    // --- Lógica para os minigames ---
    else if (estadoJogo === 'minigameSeca' && key === ' ') {
        if (barraAguaY + 80 > zonaAlvoAguaY && barraAguaY < zonaAlvoAguaY + zonaAlvoAguaAltura) { // Ajuste para o tamanho da barra
            acertosSeca++;
            plantaEstagioFlor = min(MAX_ESTAGIOS_FLOR, plantaEstagioFlor + 1); // Avança o estágio da flor
            velocidadeBarraAgua += 0.8; // Aumenta a dificuldade
            falhasConsecutivasSeca = 0; // Reseta falhas consecutivas

            // Gera nova zona alvo para o próximo acerto
            zonaAlvoAguaY = random(height * 0.3, height * 0.7);
            if (zonaAlvoTipo === 'movel') {
                zonaAlvoAguaDirecao = random([-1, 1]);
                zonaAlvoAguaVelocidade = random(1.0, 3.0);
            } else if (zonaAlvoTipo === 'aleatoria') { // NOVO: Zona alvo aleatória
                zonaAlvoAguaY = random(height * 0.3, height * 0.7);
            }
            irrigacaoEfeitoTimer = 60; // Ativa o efeito visual
            mostrarFeedback("💧 PERFEITO! +10", 10, 0, 255); // NOVO: Feedback
        } else {
            falhasConsecutivasSeca++; // Incrementa falhas consecutivas
            plantaEstagioFlor = max(0, plantaEstagioFlor - 1); // A planta regride um estágio
            score = max(0, score - 5); // Penalidade leve por erro
            mostrarFeedback("❌ ERRO! -5", 255, 0, 0); // NOVO: Feedback

            if (falhasConsecutivasSeca >= 3 || plantaEstagioFlor <= 0) { // Exemplo: 3 erros seguidos ou a planta murcha totalmente falham o minigame
                finalizarMinigameSeca(false);
            }
        }
    }
    // MODIFICAÇÃO: Lógica para ativar/desativar haste no minigame de colheita
    else if (estadoJogo === 'minigameColheita') {
        // A colheitadeira se move com as setas do teclado
        // A haste é ativada/desativada com a barra de espaço
        if (key === ' ' && !hasteQuebrada) { // Só pode ativar se a haste não estiver quebrada
            hasteColheitaAtiva = !hasteColheitaAtiva; // Alterna o estado da haste
        }
    } else if (estadoJogo === 'minigameDoenca' && key === ' ') {
        if (dosesAntidoto > 0) {
            let tratadoNestaRodada = false;
            for (let foco of focosRestantesDoenca) {
                if (!foco.tratado) {
                    let distancia = dist(drone.x, drone.y, foco.x, foco.y);
                    if (distancia < 40) { // Raio de sucesso
                        foco.tratado = true;
                        dosesAntidoto -= DOSES_POR_FOCO;
                        score += 10; // Pontos por foco tratado
                        doencaEliminadaEfeito = true; // Ativa efeito de eliminação
                        mostrarFeedback("✅ FOCO TRATADO! +10", 0, 200, 0); // NOVO: Feedback
                        setTimeout(() => {
                            doencaEliminadaEfeito = false;
                        }, 300); // Desativa efeito rapidamente
                        tratadoNestaRodada = true;
                        break; // Trata apenas um foco por vez
                    }
                }
            }

            if (!tratadoNestaRodada) {
                dosesAntidoto--; // Perde dose se não acertar nenhum foco
                score = max(0, score - 5); // Penalidade leve
                mostrarFeedback("❌ ERRO! -5", 255, 0, 0); // NOVO: Feedback
            }

            if (dosesAntidoto <= 0 && focosRestantesDoenca.some(f => !f.tratado)) {
                finalizarMinigameDoenca(false);
            } else if (focosRestantesDoenca.every(f => f.tratado)) {
                finalizarMinigameDoenca(true);
            }
        } else {
            mostrarFeedback("Sem doses de antídoto!", 255, 50, 50); // NOVO: Feedback
        }
    }
}

function mousePressed() {
    if (estadoJogo === 'iniciar') {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height / 2 + 20 && mouseY < height / 2 + 70) {
            estadoJogo = 'historia';
            historiaIndex = 0;
        }
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height / 2 + 90 && mouseY < height / 2 + 140) {
            estadoJogo = 'comoJogar';
        }
    } else if (estadoJogo === 'comoJogar') {
        if (mouseX > width / 2 - 70 && mouseX < width / 2 + 70 &&
            mouseY > height * 0.9 - 30 && mouseY < height * 0.9 + 20) {
            estadoJogo = 'iniciar';
        }
    } else if (estadoJogo === 'historia') {
        avancarHistoria();
    } else if (estadoJogo === 'fim') { // NOVO: Clicar para reiniciar na tela de fim
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height * 0.7 - 25 && mouseY < height * 0.7 + 25) {
            reiniciarJogo();
        }
    }
}

// NOVO: Adiciona mouseDragged para o minigame de praga (melhorado com cálculo de grade)
function mouseDragged() {
    if (estadoJogo === 'minigamePraga' && mouseButton === LEFT && tanquePulverizacao > 0) {
        // Desenha na área de pulverização do mapaPulverizacao
        mapaPulverizacao.fill(0, 200, 50, 150); // Verde translúcido para o spray
        mapaPulverizacao.noStroke();
        mapaPulverizacao.ellipse(mouseX, mouseY, 40, 40); // Tamanho do "spray"

        // Gasta spray com base na distância percorrida
        tanquePulverizacao -= GASTO_POR_SPRAY * (dist(mouseX, mouseY, pmouseX, pmouseY) / 10);
        tanquePulverizacao = max(0, tanquePulverizacao);

        // NOVO: Marca a célula da grade como pulverizada (lógica de grade)
        // Converte coordenadas do mouse para coordenadas relativas à área da praga
        let relativeMouseX = mouseX - areaAlvoPragaX;
        let relativeMouseY = mouseY - areaAlvoPragaY;

        let col = floor(relativeMouseX / PRAGA_GRID_SIZE);
        let row = floor(relativeMouseY / PRAGA_GRID_SIZE);

        // Verifica se a célula está dentro dos limites da grade da praga
        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
            if (!pragaGrid[row][col]) {
                pragaGrid[row][col] = true;
                pixelsPulverizados++; // Incrementa o contador de células pulverizadas
            }
        }

        // Adiciona partículas para o efeito visual de spray
        sprayParticleSystem.addParticle(mouseX, mouseY);
    }
}

// ===============================================
// Funções de Controle de Jogo (Aprimoradas)
// ===============================================

// NOVO: Função para avançar na história
function avancarHistoria() {
    historiaIndex++;
    if (historiaIndex >= historiaTextos.length) {
        estadoJogo = 'jogando';
        reiniciarJogo(); // Começa o jogo principal após a história
    }
}

// NOVO: Função para reiniciar o jogo
function reiniciarJogo() {
    score = 0;
    tempoRestante = 90;
    saudeFazenda = 100; // Reseta a saúde da fazenda
    problemas = [];
    drone = new Drone(width / 2, height / 2); // Reseta a posição do drone
    for (let i = 0; i < plantas.length; i++) { // Reseta as plantas (se tiver lógica de saúde para elas)
        plantas[i] = new Planta(random(width), random(height));
    }
    generateProblem(3); // Gera alguns problemas iniciais (MELHORADO: nome da função)
    ultimoProblemaGerado = millis(); // Reseta o timer de geração de problemas

    // Garante que nenhum minigame esteja ativo
    clearTimeout(minigamePragaTimeoutId);
    clearTimeout(minigameSecaTimeoutId);
    clearTimeout(minigameColheitaTimeoutId);
    clearTimeout(minigameDoencaTimeoutId);

    // Reseta todos os minigames para seus estados iniciais
    resetarMinigamePraga();
    resetarMinigameSeca();
    resetarMinigameColheita();
    resetarMinigameDoenca();

    problemaAtual = null; // Limpa a referência ao problema atual
    feedbackTimer = 0; // Reseta feedback
    feedbackText = "";
}

// NOVO: Lógica principal do jogo
function executarJogoPrincipal() {
    // Atualiza e desenha as plantas
    for (let planta of plantas) {
        planta.display();
    }

    // Gera novos problemas periodicamente
    if (millis() - ultimoProblemaGerado > PROBLEMA_TEMPO_GERACAO * 1000 && problemas.length < MAX_PROBLEMAS_ATIVOS) {
        generateProblem(1);
        ultimoProblemoGerado = millis();
    }

    // Atualiza e desenha o drone
    drone.update();
    drone.display();

    // Desenha e verifica problemas
    for (let i = problemas.length - 1; i >= 0; i--) {
        let p = problemas[i];
        p.display();
        p.checkInteraction(drone); // Verifica se o drone interage com o problema
    }

    // Deterioração da saúde da fazenda por problemas não resolvidos
    if (problemas.length > 0) {
        saudeFazenda -= (problemas.length * TAXA_DETERIORACAO_PROBLEMA) * (deltaTime / 1000); // Tira saúde com base no número de problemas e tempo
        saudeFazenda = max(0, saudeFazenda); // Garante que não vá abaixo de 0
    }

    // Exibe score, tempo e saúde da fazenda
    exibirStatusJogo(); // NOVO: Função para exibir status

    // Decrementa o tempo restante
    if (frameCount % 60 === 0) { // A cada segundo (aproximadamente)
        tempoRestante--;
    }

    // Condição de fim de jogo
    if ((tempoRestante <= 0 || saudeFazenda <= 0) && estadoJogo === 'jogando') {
        estadoJogo = 'fim';
    }
}

// NOVO: Função para exibir status do jogo
function exibirStatusJogo() {
    fill(255);
    textSize(24);
    textAlign(LEFT);
    text(`Score: ${score}`, 20, 30);
    text(`Tempo: ${floor(tempoRestante)}s`, 20, 60);

    // Exibir saúde da fazenda como barra e texto
    textAlign(RIGHT);
    text(`Saúde da Fazenda: ${floor(saudeFazenda)}%`, width - 20, 30);

    // Desenhar barra de saúde
    let healthColor = lerpColor(color(255, 0, 0), color(0, 255, 0), saudeFazenda / 100);
    fill(healthColor);
    rect(width - uiHealthBarWidth - 20, 45, uiHealthBarWidth * (saudeFazenda / 100), uiHealthBarHeight);
    noFill();
    stroke(255);
    strokeWeight(2);
    rect(width - uiHealthBarWidth - 20, 45, uiHealthBarWidth, uiHealthBarHeight);
    noStroke();

    textAlign(LEFT); // Retorna ao padrão
}

// NOVO: Função para mostrar feedback temporário
function mostrarFeedback(text, r, g, b) {
    feedbackText = text;
    feedbackTimer = FEEDBACK_DURATION;
    fill(r, g, b); // Define a cor do feedback para customização
}

// ===============================================
// Classes (Aprimoradas)
// ===============================================

// Classe Drone (mantida)
class Drone {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tamanho = 40;
        this.velocidade = 5;
        this.inclinacao = 0; // Novo: para animação de inclinação
        this.rotacaoHelice = 0; // Novo: para animação da hélice
    }

    update() {
        let targetInclinacao = 0;
        // Permite controlar o drone no jogo principal
        if (estadoJogo === 'jogando' || estadoJogo === 'minigameDoenca') { // Permite mover no minigame de doença também
            if (keyIsDown(UP_ARROW)) {
                this.y -= this.velocidade;
            }
            if (keyIsDown(DOWN_ARROW)) {
                this.y += this.velocidade;
            }
            if (keyIsDown(LEFT_ARROW)) {
                this.x -= this.velocidade;
                targetInclinacao = -0.2; // Inclina para a esquerda
            }
            if (keyIsDown(RIGHT_ARROW)) {
                this.x += this.velocidade;
                targetInclinacao = 0.2; // Inclina para a direita
            }
        }

        // Suaviza a inclinação
        this.inclinacao = lerp(this.inclinacao, targetInclinacao, 0.1);

        // Animação da hélice
        this.rotacaoHelice += 0.5; // Aumenta a velocidade da rotação

        // Limita o drone à tela
        this.x = constrain(this.x, this.tamanho / 2, width - this.tamanho / 2);
        this.y = constrain(this.y, this.tamanho / 2, height - this.tamanho / 2);
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.inclinacao); // Aplica a inclinação

        // Corpo do drone
        fill(150);
        rect(-this.tamanho / 2, -this.tamanho / 2, this.tamanho, this.tamanho);

        // Hélices (efeito de rotação)
        fill(200);
        noStroke();
        let heliceSpeed = this.rotacaoHelice * 0.1; // Ajusta a velocidade visual da hélice
        for (let i = 0; i < 4; i++) {
            push();
            rotate(heliceSpeed + i * PI / 2); // Rotação individual para cada hélice
            rect(0, -this.tamanho / 10, this.tamanho / 2, this.tamanho / 5); // Forma da hélice
            pop();
        }

        // Efeito de propulsão (simples)
        if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
            fill(255, 200, 0, 100 + sin(frameCount * 0.2) * 50); // Cor e opacidade pulsante
            ellipse(0, this.tamanho * 0.6, this.tamanho * 0.4); // "Jato" de air
        }
        pop();
    }
}

// NOVO: Classe Colheitadeira
class Colheitadeira {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.largura = 100;
        this.altura = 80;
        this.velocidade = 4; // Um pouco mais lenta que o drone
        this.rotacaoRoda = 0; // Para animação das rodas
    }

    update() {
        // Controles com as setas do teclado
        if (keyIsDown(UP_ARROW)) {
            this.y -= this.velocidade;
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.y += this.velocidade;
        }
        if (keyIsDown(LEFT_ARROW)) {
            this.x -= this.velocidade;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.x += this.velocidade;
        }

        // Animação das rodas
        if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
            this.rotacaoRoda += 0.2;
        }


        // Limita a colheitadeira à tela
        this.x = constrain(this.x, this.largura / 2, width - this.largura / 2);
        this.y = constrain(this.y, this.altura / 2, height - this.altura / 2);
    }

    display() {
        push();
        translate(this.x, this.y);
        noStroke();

        // Corpo principal da colheitadeira (cabine)
        fill(200, 100, 0); // Laranja / Amarelo de colheitadeira
        rect(-this.largura / 2, -this.altura / 2, this.largura, this.altura, 5);

        // Cabine do motorista
        fill(150, 75, 0);
        rect(this.largura * 0.1, -this.altura / 2 - 30, this.largura * 0.5, 30, 5);
        fill(100, 150, 200); // Vidro da cabine
        rect(this.largura * 0.15, -this.altura / 2 - 25, this.largura * 0.4, 20);

        // Rodas
        fill(50); // Pneus escuros
        ellipse(-this.largura * 0.3, this.altura / 2 - 5, 30, 30); // Roda dianteira esquerda
        ellipse(this.largura * 0.3, this.altura / 2 - 5, 30, 30); // Roda dianteira direita

        // Eixo das rodas (apenas visual, não interfere na rotação)
        stroke(80);
        strokeWeight(2);
        line(-this.largura * 0.3, this.altura / 2 - 5, this.largura * 0.3, this.altura / 2 - 5);
        noStroke();

        // Animação das rodas
        push();
        translate(-this.largura * 0.3, this.altura / 2 - 5);
        rotate(this.rotacaoRoda);
        stroke(100);
        strokeWeight(1);
        line(-10, 0, 10, 0);
        line(0, -10, 0, 10);
        pop();

        push();
        translate(this.largura * 0.3, this.altura / 2 - 5);
        rotate(this.rotacaoRoda);
        stroke(100);
        strokeWeight(1);
        line(-10, 0, 10, 0);
        line(0, -10, 0, 10);
        pop();

        pop(); // Volta para o sistema de coordenadas original
    }
}


// Classe Planta (mantida)
class Planta {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.saude = 100; // Exemplo de atributo de saúde
    }

    display() {
        fill(50, 200, 50); // Verde vibrante
        ellipse(this.x, this.y, 20, 30);
        fill(0, 100, 0);
        rect(this.x - 2, this.y + 10, 4, 10);
    }
}

// Classe Problema (COM ATUALIZAÇÕES VISUAIS - Aprimorado)
class Problema {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tamanho = 30;
        this.tipo = tipo; // 'praga', 'seca', 'colheita', 'doenca'
        this.interagido = false; // Para evitar múltiplos inícios de minigame
        this.tempoCriacao = millis(); // Para rastrear a urgência
    }

    display() {
        if (this.interagido) return;

        push();
        translate(this.x, this.y);
        noStroke();

        // Calcular urgência baseada no tempo que o problema existe
        let tempoExistencia = (millis() - this.tempoCriacao) / 1000; // Tempo em segundos
        let opacidadeUrgencia = map(tempoExistencia, 0, PROBLEMA_TEMPO_GERACAO * 3, 0, 150, true); // Aumenta opacidade com o tempo
        let tamanhoUrgencia = map(tempoExistencia, 0, PROBLEMA_TEMPO_GERACAO * 3, 0, 10, true); // Aumenta tamanho do alerta

        // Desenha um fundo/borda pulsante para urgência
        fill(255, 0, 0, opacidadeUrgencia + sin(frameCount * 0.1) * 50);
        ellipse(0, 0, this.tamanho + tamanhoUrgencia + sin(frameCount * 0.05) * 5);

        if (this.tipo === 'praga') {
            fill(255, 255, 0); // Amarelo sólido para o ícone
            ellipse(0, 0, this.tamanho);
            fill(0);
            textSize(this.tamanho * 0.6);
            text("🐛", 0, 0); // Ícone de praga
        } else if (this.tipo === 'seca') {
            fill(150, 100, 50); // Marrom sólido
            ellipse(0, 0, this.tamanho);
            fill(255);
            textSize(this.tamanho * 0.6);
            text("💧", 0, 0); // Ícone de gota d'água
        } else if (this.tipo === 'colheita') {
            fill(255, 140, 0); // Laranja sólido
            ellipse(0, 0, this.tamanho);
            fill(255);
            textSize(this.tamanho * 0.6);
            text("🌾", 0, 0); // Ícone de trigo
        } else if (this.tipo === 'doenca') {
            fill(200, 0, 0); // Vermelho sólido
            ellipse(0, 0, this.tamanho);
            fill(255);
            textSize(this.tamanho * 0.6);
            text("🦠", 0, 0); // Ícone de vírus/bactéria
        }
        pop();
    }

    checkInteraction(drone) {
        if (this.interagido) return;

        let d = dist(drone.x, drone.y, this.x, this.y);
        if (d < drone.tamanho / 2 + this.tamanho / 2 + 10) { // Área de interação um pouco maior
            this.interagido = true;
            problemaAtual = this; // Define o problema que iniciou o minigame
            iniciarMinigame(this.tipo);
        }
    }
}

// Classe para os grãos no minigame de colheita (Aprimorado)
class Grao {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo; // 'normal', 'ouro', 'podre', 'pedra'
        this.tamanho = 15;
    }

    display() {
        push();
        translate(this.x, this.y);
        noStroke();
        if (this.tipo === 'normal') fill(200, 180, 0);
        else if (this.tipo === 'ouro') fill(255, 215, 0); // Ouro
        else if (this.tipo === 'podre') fill(80, 50, 0); // Marrom escuro
        else if (this.tipo === 'pedra') fill(100); // Cinza
        ellipse(0, 0, this.tamanho);
        pop();
    }
}


// Classe para sistema de partículas (para o spray - mantido)
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.alpha = 255;
        this.size = random(5, 10);
        this.fill = color(0, 200, 255, 200); // Cor padrão de spray
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 5; // Desaparece
        this.size *= 0.95; // Diminui
    }

    display() {
        noStroke();
        fill(this.fill, this.alpha); // Usa a cor definida
        ellipse(this.x, this.y, this.size);
    }

    isDead() {
        return this.alpha < 0.1 || this.size < 1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    addParticle(x, y) {
        if (this.particles.length < 100) { // Limita o número de partículas
            this.particles.push(new Particle(x, y));
        }
    }

    run() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update();
            p.display();
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
}

// ===============================================
// Funções de Geração de Problemas (Aprimoradas)
// ===============================================

// NOVO: Função para gerar um número específico de problemas
function generateProblem(numProblemas) { // MELHORADO: nome da função
    const tiposProblema = ['praga', 'seca', 'colheita', 'doenca'];
    for (let i = 0; i < numProblemas; i++) {
        if (problemas.length < MAX_PROBLEMAS_ATIVOS) { // Limita o número de problemas na tela
            let tipoAleatorio = random(tiposProblema);
            // Evita gerar problema muito próximo da borda
            let px = random(50, width - 50);
            let py = random(50, height - 50);
            problemas.push(new Problema(px, py, tipoAleatorio));
        }
    }
}

// NOVO: Função para iniciar o minigame correto
function iniciarMinigame(tipo) {
    if (tipo === 'praga') {
        estadoJogo = 'minigamePraga';
        iniciarMinigamePraga();
    } else if (tipo === 'seca') {
        estadoJogo = 'minigameSeca';
        iniciarMinigameSeca();
    } else if (tipo === 'colheita') {
        estadoJogo = 'minigameColheita';
        iniciarMinigameColheita();
    } else if (tipo === 'doenca') {
        estadoJogo = 'minigameDoenca';
        iniciarMinigameDoenca();
    }
}

// ===============================================
// Telas do Jogo (Aprimoradas)
// ===============================================

function mostrarTelaInicial() {
    background(50, 100, 50);
    textAlign(CENTER);

    // Efeito de gradiente ou fundo dinâmico
    for (let i = 0; i < height; i++) {
        let c = lerpColor(color(50, 80, 100), color(100, 150, 50), i / height);
        stroke(c);
        line(0, i, width, i);
    }

    fill(255, 255, 100);
    textSize(48);
    // Animação de brilho no título
    let alphaTitle = map(sin(frameCount * 0.05), -1, 1, 150, 255);
    fill(255, 255, 100, alphaTitle);
    text("DRONE AGRÍCOLA", width / 2, height / 2 - 100);
    textSize(24);
    text("RECONHECENDO PROBLEMAS", width / 2, height / 2 - 60);

    // Botões interativos com animação de "pop"
    let buttonWidth = 200;
    let buttonHeight = 50;
    let buttonRadius = 10;

    // Iniciar Jogo Button
    let btnIniciarX = width / 2 - buttonWidth / 2;
    let btnIniciarY = height / 2 + 20;
    let scaleIniciar = 1;
    if (mouseX > btnIniciarX && mouseX < btnIniciarX + buttonWidth &&
        mouseY > btnIniciarY && mouseY < btnIniciarY + buttonHeight) {
        scaleIniciar = 1.05; // Escala um pouco quando o mouse está em cima
    }
    push();
    translate(width / 2, btnIniciarY + buttonHeight / 2);
    scale(scaleIniciar);
    fill(0, 150, 0);
    rect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, buttonRadius);
    fill(255);
    textSize(28);
    text("Iniciar Jogo", 0, 8);
    pop();

    // Como Jogar Button
    let btnComoX = width / 2 - buttonWidth / 2;
    let btnComoY = height / 2 + 90;
    let scaleComo = 1;
    if (mouseX > btnComoX && mouseX < btnComoX + buttonWidth &&
        mouseY > btnComoY && mouseY < btnComoY + buttonHeight) {
        scaleComo = 1.05;
    }
    push();
    translate(width / 2, btnComoY + buttonHeight / 2);
    scale(scaleComo);
    fill(0, 100, 150);
    rect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, buttonRadius);
    fill(255);
    textSize(28);
    text("Como Jogar", 0, 8);
    pop();

    textSize(16);
    fill(255, 200, 0);
    text("Pressione ENTER para Iniciar ou 'C' para Como Jogar", width / 2, height - 30);
}

function mostrarTelaComoJogar() {
    background(70, 70, 120);
    textAlign(CENTER);
    fill(255);
    textSize(36);
    text("COMO JOGAR", width / 2, height / 8);

    textSize(20);
    textAlign(LEFT);
    let startX = width / 8;
    let startY = height / 5;
    let lineHeight = 30;

    text("Objetivo:", startX, startY);
    text("Pilote seu drone para identificar e resolver problemas na plantação.", startX + 20, startY + lineHeight);
    text("Ganhe pontos resolvendo problemas e perca se o tempo acabar ou a saúde da fazenda chegar a 0.", startX + 20, startY + 2 * lineHeight); // ATUALIZADO

    startY += 3 * lineHeight + 20;

    text("Controles do Drone:", startX, startY);
    text("Setas do Teclado: Mover o drone (Cima, Baixo, Esquerda, Direita).", startX + 20, startY + lineHeight);

    startY += 2 * lineHeight + 20;

    text("Minigames:", startX, startY);
    text("- Praga (Alvo Amarelo com '🐛'): Mantenha o mouse pressionado para pulverizar a área da praga.", startX + 20, startY + lineHeight);
    text("- Seca (Alvo Marrom com '💧'): Pressione ESPAÇO quando a barra de água estiver na zona alvo para florir a planta.", startX + 20, startY + 2 * lineHeight); // ATUALIZADO
    text("- Colheita (Alvo Laranja com '🌾'): Mova a colheitadeira com as setas para colher. Pressione ESPAÇO para ativar a haste.", startX + 20, startY + 3 * lineHeight);
    text("- Doença (Alvo Vermelho com '🦠'): Pressione ESPAÇO perto dos focos de doença para aplicar o antídoto.", startX + 20, startY + 4 * lineHeight);

    // Botão Voltar
    fill(150, 0, 0);
    rect(width / 2 - 70, height * 0.9 - 30, 140, 50, 10);
    fill(255);
    textSize(24);
    textAlign(CENTER);
    text("Voltar", width / 2, height * 0.9);
    textSize(16);
    fill(255, 200, 0);
    text("Pressione ESC ou BACKSPACE para Voltar", width / 2, height - 30);
}

// NOVO: Funções para desenhar cenas da história
function drawSceneCampoCidade() {
    // Céu
    fill(135, 206, 235);
    rect(0, 0, width, height / 2);
    // Campo
    fill(100, 150, 50);
    rect(0, height / 2, width, height / 2);
    // Silhueta de cidade
    fill(80);
    rect(width * 0.7, height / 2 - 100, 150, 100);
    rect(width * 0.6, height / 2 - 150, 80, 150);
    rect(width * 0.8, height / 2 - 70, 70, 70);
    // Plantações simples
    fill(50, 120, 50);
    ellipse(width * 0.2, height * 0.7, 40, 60);
    ellipse(width * 0.35, height * 0.8, 50, 70);
}

function drawSceneDonaBenta() {
    // Fundo do campo: Tons de verde vibrantes
    background(120, 180, 80); // Verde grama
    fill(100, 160, 60); // Verde mais escuro para plantações
    rect(0, height * 0.6, width, height * 0.4); // Campo principal

    // Montanhas/Colinas ao fundo
    fill(80, 120, 70);
    triangle(0, height * 0.4, width / 3, height * 0.2, width * 0.6, height * 0.4);
    triangle(width * 0.4, height * 0.4, width * 0.7, height * 0.1, width, height * 0.4);

    // Céu com nuvens
    fill(135, 206, 235); // Azul claro
    rect(0, 0, width, height * 0.6);
    fill(255, 255, 255, 200); // Nuvens brancas translúcidas
    ellipse(width * 0.2, height * 0.15, 100, 60);
    ellipse(width * 0.5, height * 0.1, 150, 80);
    ellipse(width * 0.8, height * 0.2, 120, 70);

    // Plantações detalhadas (Exemplo: "Milho")
    fill(180, 200, 50); // Verde amarelado para milho
    for (let i = 0; i < 8; i++) {
        let x = width * 0.1 + i * (width * 0.8 / 7);
        rect(x, height * 0.6 - 50, 10, 50); // Tronco
        ellipse(x + 5, height * 0.6 - 55, 20, 15); // Folhas
        fill(255, 200, 0);
        ellipse(x + 5, height * 0.6 - 70, 15, 25); // Espiga de milho
        fill(180, 200, 50); // Volta ao verde para próximas
    }

    // Dona Benta mais detalhada
    push();
    translate(width / 2, height / 2 + 50); // Ajusta a posição para o chão

    // Corpo e Roupas
    fill(200, 80, 0); // Vestido marrom-avermelhado
    ellipse(0, 0, 80, 100);
    fill(100, 50, 0); // Avental
    rect(-30, -20, 60, 50);

    // Braços (posição de preocupação)
    stroke(150, 100, 50); // Cor da pele
    strokeWeight(8);
    line(-30, -30, -50, 10);
    line(30, -30, 50, 10);
    noStroke();

    // Rosto
    fill(250, 200, 150); // Pele
    ellipse(0, -70, 60, 60);
    fill(0);
    ellipse(-10, -75, 5, 5); // Olhos
    ellipse(10, -75, 5, 5);
    arc(0, -60, 20, 10, 0, PI); // Boca curvada (preocupação)

    // Cabelo
    fill(100, 50, 0); // Cabelo castanho
    ellipse(0, -85, 70, 30);

    // Chapéu de palha
    fill(255, 220, 100);
    ellipse(0, -100, 100, 40); // Aba
    rect(-30, -110, 60, 20, 5); // Copa
    fill(150, 0, 0); // Fita do chapéu
    rect(-40, -100, 80, 5);

    pop();
}

function drawSceneDrUrbano() {
    // Fundo do Laboratório: Paredes metálicas e vidros
    background(50, 50, 70); // Cinza escuro/azulado
    fill(80, 80, 100);
    rect(0, height * 0.1, width, height * 0.8, 10); // Painel principal
    
    // Detalhes da parede: Linhas futuristas
    stroke(100, 100, 120);
    strokeWeight(2);
    line(width * 0.2, height * 0.1, width * 0.2, height * 0.9);
    line(width * 0.8, height * 0.1, width * 0.8, height * 0.9);
    noStroke();

    // Janela com vista para a cidade noturna
    fill(20, 20, 40); // Escuro da noite
    rect(width * 0.65, height * 0.15, width * 0.3, height * 0.3);
    fill(50, 50, 80); // Prédios distantes
    rect(width * 0.7, height * 0.3, 30, 80);
    rect(width * 0.78, height * 0.25, 40, 100);
    fill(255, 255, 0, 100); // Luzes de prédios
    rect(width * 0.72, height * 0.35, 5, 10);
    rect(width * 0.79, height * 0.3, 5, 10);


    // Mesa de laboratório
    fill(40, 40, 60);
    rect(width / 2 - 200, height / 2 + 50, 400, 100, 10);
    fill(20, 20, 30); // Sombra da mesa
    rect(width / 2 - 180, height / 2 + 100, 360, 20);

    // Equipamentos na mesa
    fill(100, 100, 150); // Computador/monitor
    rect(width / 2 - 150, height / 2, 80, 50);
    fill(0, 255, 255); // Tela azul
    rect(width / 2 - 145, height / 2 + 5, 70, 40);

    fill(150, 200, 255); // Tubo de ensaio
    rect(width / 2 + 50, height / 2 + 10, 20, 60);
    fill(0, 200, 0, 100); // Líquido verde
    rect(width / 2 + 50, height / 2 + 40, 20, 30);
    
    // Pequeno modelo de drone na mesa
    fill(150);
    rect(width / 2 + 120, height / 2 + 20, 40, 20, 5); // Corpo
    fill(180);
    ellipse(width / 2 + 130, height / 2 + 20, 10, 5); // Hélice
    ellipse(width / 2 + 150, height / 2 + 20, 10, 5);


    // Dr. Urbano mais detalhado
    push();
    translate(width / 2 - 100, height / 2 + 50); // Posição ao lado da mesa

    // Jaleco
    fill(230, 240, 255); // Branco acinzentado
    rect(-40, -80, 80, 150);
    fill(150, 150, 200); // Detalhes do jaleco
    rect(-35, -70, 70, 10); // Gola
    rect(-30, 0, 60, 10); // Bolso

    // Rosto e Cabelo
    fill(250, 200, 150); // Pele
    ellipse(0, -100, 60, 60);
    fill(50, 50, 50); // Cabelo bagunçado
    ellipse(0, -115, 70, 40); // Parte de cima do cabelo
    rect(-30, -110, 60, 20); // Laterais

    // Óculos
    noFill();
    stroke(50);
    strokeWeight(3);
    ellipse(-15, -100, 25, 20);
    ellipse(15, -100, 25, 20);
    line(-2, -100, 2, -100); // Ponte
    noStroke();

    // Olhos
    fill(0);
    ellipse(-15, -100, 5, 5);
    ellipse(15, -100, 5, 5);

    // Boca (sorriso sutil de quem teve uma ideia)
    fill(0);
    arc(0, -85, 20, 10, 0, PI);

    // Mão na postura de "ideia"
    fill(250, 200, 150); // Cor da pele
    ellipse(60, -130, 20, 30); // Mão
    fill(255, 255, 200, 150);
    ellipse(70, -160, 50, 30); // Balão de pensamento
    fill(0);
    textSize(20);
    text("💡", 70, -160); // Ícone de ideia

    pop();
}

function drawSceneConexoes() {
    // Metade campo, metade cidade
    fill(100, 150, 50);
    rect(0, 0, width / 2, height);
    fill(80);
    rect(width / 2, 0, width / 2, height);
    // Setas indicando conexão
    stroke(255, 200, 0);
    strokeWeight(5);
    line(width / 4, height / 2, width * 0.75, height / 2);
    triangle(width * 0.75 - 20, height / 2 - 10, width * 0.75 - 20, height / 2 + 10, width * 0.75, height / 2);
    noStroke();
}

function drawSceneProblemasCampo() {
    // Campo com elementos de problemas
    fill(100, 150, 50);
    rect(0, 0, width, height);
    // Praga
    fill(255, 255, 0);
    ellipse(width * 0.3, height * 0.4, 50, 50);
    fill(0);
    textSize(30);
    text("🐛", width * 0.3, height * 0.4);
    // Seca
    fill(150, 100, 50);
    ellipse(width * 0.7, height * 0.6, 50, 50);
    fill(255);
    textSize(30);
    text("💧", width * 0.7, height * 0.6);
    // Doença (manchas na planta)
    fill(50, 180, 50);
    ellipse(width * 0.5, height * 0.8, 60, 80);
    fill(200, 0, 0, 150);
    ellipse(width * 0.5 - 10, height * 0.78, 20, 20);
    ellipse(width * 0.5 + 15, height * 0.82, 18, 18);
}

function drawSceneProblemasCidade() {
    // Dr. Urbano pensando no drone
    drawSceneDrUrbano();
    fill(255, 255, 200, 150);
    ellipse(width * 0.6, height / 3, 80, 50); // Balão de pensamento
    fill(0);
    textSize(24);
    text("💡", width * 0.6, height / 3); // Ícone de ideia
}

function drawSceneDrone() {
    // Campo com um drone futurista
    fill(100, 150, 50);
    rect(0, 0, width, height);
    // Drone desenhado com mais detalhes
    fill(180, 180, 255); // Azul metálico
    rect(width / 2 - 80, height / 2 - 30, 160, 60, 10);
    fill(150, 150, 200);
    ellipse(width / 2 - 60, height / 2 - 30, 40, 20); // Hélices
    ellipse(width / 2 + 60, height / 2 - 30, 40, 20);
    ellipse(width / 2 - 60, height / 2 + 30, 40, 20);
    ellipse(width / 2 + 60, height / 2 + 30, 40, 20);
    fill(50); // Câmera/sensor
    ellipse(width / 2, height / 2 + 10, 20, 20);
}

function drawSceneDonaBentaDrone() {
    drawSceneDonaBenta();
    drawSceneDrone(); // Drone voando sobre Dona Benta
    fill(255, 255, 200, 150);
    ellipse(width / 2 + 100, height / 2 - 100, 80, 50);
    fill(0);
    textSize(24);
    text("✨", width / 2 + 100, height / 2 - 100); // Ícone de maravilha
}

function drawSceneDrUrbanoDrone() {
    drawSceneDrUrbano();
    drawSceneDrone(); // Drone ao lado de Dr. Urbano
    fill(255, 255, 200, 150);
    ellipse(width / 2 - 100, height / 2 - 100, 80, 50);
    fill(0);
    textSize(24);
    text("🚀", width / 2 - 100, height / 2 - 100); // Ícone de lançamento
}

function drawSceneMissao() {
    // Campo com alvos e drone
    fill(100, 150, 50);
    rect(0, 0, width, height);
    drawSceneDrone(); // Drone centralizado
    fill(255, 0, 0, 100);
    ellipse(width * 0.3, height * 0.7, 70, 70); // Alvo 1
    ellipse(width * 0.7, height * 0.3, 70, 70); // Alvo 2
    fill(255);
    textSize(40);
    text("🎯", width * 0.3, height * 0.7);
    text("🎯", width * 0.7, height * 0.3);
}

function drawSceneHarmonia() {
    // Campo vibrante, cidade ao fundo, sol
    fill(100, 180, 80); // Campo mais saudável
    rect(0, 0, width, height);
    fill(135, 206, 250); // Céu azul
    rect(0, 0, width, height / 2);
    fill(255, 200, 0); // Sol
    ellipse(width * 0.8, height * 0.2, 100, 100);
    drawSceneConexoes(); // Simboliza a conexão
    fill(0, 100, 0);
    textSize(60);
    text("🌱", width / 2, height * 0.7); // Plantação feliz
    fill(255);
    textSize(40);
    text("🤝", width / 2, height / 2 - 50); // Aperto de mãos
}

function drawSceneFimHistoria() {
    // Campo e cidade em harmonia
    drawSceneHarmonia();
    // Drone voando para o pôr do sol
    push();
    translate(width * 0.8, height * 0.3);
    rotate(PI / 8); // Inclina o drone
    fill(180, 180, 255);
    rect(-40, -15, 80, 30, 5);
    fill(150, 150, 200);
    ellipse(-30, -15, 20, 10);
    ellipse(30, -15, 20, 10);
    pop();
    fill(255, 100, 0, 100 + sin(frameCount * 0.1) * 50); // Efeito de luz do sol
    ellipse(width * 0.8, height * 0.3, 150, 150);
}


function mostrarHistoria() {
    background(0);
    textAlign(CENTER);

    // Desenha a cena atual
    if (historiaTextos[historiaIndex].scene === "campoCidade") {
        drawSceneCampoCidade();
    } else if (historiaTextos[historiaIndex].scene === "donaBenta") {
        drawSceneDonaBenta();
    } else if (historiaTextos[historiaIndex].scene === "drUrbano") {
        drawSceneDrUrbano();
    } else if (historiaTextos[historiaIndex].scene === "conexoes") {
        drawSceneConexoes();
    } else if (historiaTextos[historiaIndex].scene === "problemasCampo") {
        drawSceneProblemasCampo();
    } else if (historiaTextos[historiaIndex].scene === "problemasCidade") {
        drawSceneProblemasCidade();
    } else if (historiaTextos[historiaIndex].scene === "drone") {
        drawSceneDrone();
    } else if (historiaTextos[historiaIndex].scene === "donaBentaDrone") {
        drawSceneDonaBentaDrone();
    } else if (historiaTextos[historiaIndex].scene === "drUrbanoDrone") {
        drawSceneDrUrbanoDrone();
    } else if (historiaTextos[historiaIndex].scene === "missao") {
        drawSceneMissao();
    } else if (historiaTextos[historiaIndex].scene === "harmonia") {
        drawSceneHarmonia();
    } else if (historiaTextos[historiaIndex].scene === "fimHistoria") {
        drawSceneFimHistoria();
    }

    // Fundo semitransparente para o texto
    fill(0, 0, 0, 180);
    rect(0, height * 0.75, width, height * 0.25);

    fill(255);
    textSize(28);
    // Efeito de digitação para o texto da história
    let currentText = historiaTextos[historiaIndex].text;
    let displayLength = floor((millis() - (historiaIndex * 2000)) / 50); // Ajuste a velocidade da digitação
    text(currentText.substring(0, displayLength), width / 2, height * 0.85);

    fill(255, 200, 0);
    textSize(20);
    text("Pressione ESPAÇO ou clique para continuar...", width / 2, height * 0.95);
}


function mostrarTelaFim() {
    background(0);
    textAlign(CENTER);
    fill(255);
    textSize(48);
    if (saudeFazenda <= 0) {
        text("A FAZENDA PERDEU A SAÚDE!", width / 2, height / 3);
        fill(255, 0, 0);
        textSize(36);
        text("MISSÃO FALHOU!", width / 2, height / 2);
    } else {
        text("TEMPO ESGOTADO!", width / 2, height / 3);
        fill(0, 255, 0);
        textSize(36);
        text("MISSÃO CONCLUÍDA!", width / 2, height / 2);
    }

    fill(255);
    textSize(32);
    text(`Seu Score Final: ${score}`, width / 2, height * 0.6);

    fill(0, 150, 0);
    rect(width / 2 - 100, height * 0.7 - 25, 200, 50, 10);
    fill(255);
    textSize(28);
    text("Reiniciar (R)", width / 2, height * 0.7 + 5);
}

// ===============================================
// Funções Minigame Praga (Aprimoradas)
// ===============================================

function iniciarMinigamePraga() {
    minigamePragaStartTime = millis();
    tanquePulverizacao = 100; // Reseta o tanque
    pragaEliminadaEfeito = false;
    mapaPulverizacao.clear(); // Limpa o gráfico do spray

    // Define a área alvo da praga (ALEATÓRIA E DINÂMICA)
    areaAlvoPragaLargura = random(150, 250);
    areaAlvoPragaAltura = random(150, 250);
    areaAlvoPragaX = random(width * 0.2, width * 0.8 - areaAlvoPragaLargura);
    areaAlvoPragaY = random(height * 0.2, height * 0.8 - areaAlvoPragaAltura);

    // Reinicializa a grade da praga
    gridCols = floor(areaAlvoPragaLargura / PRAGA_GRID_SIZE);
    gridRows = floor(areaAlvoPragaAltura / PRAGA_GRID_SIZE);
    pragaGrid = Array(gridRows).fill(0).map(() => Array(gridCols).fill(false));
    pixelsPulverizados = 0;
    totalPixelsAlvo = gridCols * gridRows;

    // Define o tipo de praga para o minigame
    let tipos = ['estacionaria', 'espalhando', 'movel'];
    pragaTipo = random(tipos);

    // Posição inicial da praga (no centro da área alvo)
    pragaCurrentX = areaAlvoPragaX + areaAlvoPragaLargura / 2;
    pragaCurrentY = areaAlvoPragaY + areaAlvoPragaAltura / 2;

    // Define timeout para o minigame
    minigamePragaTimeoutId = setTimeout(() => {
        finalizarMinigamePraga(false); // Falha se o tempo acabar
    }, TEMPO_MINIGAME_PRAGA * 1000);
}

function executarMinigamePraga() {
    background(100, 150, 100); // Fundo do campo

    // Desenha a área pulverizada
    image(mapaPulverizacao, 0, 0);

    // Desenha a área alvo da praga
    noFill();
    stroke(255, 0, 0, 100);
    strokeWeight(3);
    rect(areaAlvoPragaX, areaAlvoPragaY, areaAlvoPragaLargura, areaAlvoPragaAltura);

    // Animação e desenho da praga alvo
    push();
    translate(pragaCurrentX, pragaCurrentY);

    // Efeito de desaparecimento da praga
    if (pragaEliminadaEfeito) {
        pragaCorpoAlpha = max(0, pragaCorpoAlpha - 10); // Diminui a opacidade
    }
    tint(255, pragaCorpoAlpha); // Aplica opacidade à imagem
    image(pragaAlvoImage, -pragaTamanhoBase / 2, -pragaTamanhoBase / 2, pragaTamanhoBase, pragaTamanhoBase);
    noTint(); // Remove o tint para outros desenhos

    // Efeitos visuais da praga (pulsação, brilho)
    fill(255, 200, 0, 100 + sin(frameCount * 0.1) * 50);
    ellipse(0, 0, pragaTamanhoBase * 1.2 + sin(frameCount * 0.08) * 10); // Pulsação
    pop();

    // Lógica de tipos de praga
    if (pragaTipo === 'movel') {
        pragaCurrentX += pragaMoveDirectionX * PRAGA_MOVE_SPEED;
        pragaCurrentY += pragaMoveDirectionY * PRAGA_MOVE_SPEED;

        // Inverte direção ao atingir a borda da área alvo
        if (pragaCurrentX < areaAlvoPragaX + pragaTamanhoBase / 2 || pragaCurrentX > areaAlvoPragaX + areaAlvoPragaLargura - pragaTamanhoBase / 2) {
            pragaMoveDirectionX *= -1;
        }
        if (pragaCurrentY < areaAlvoPragaY + pragaTamanhoBase / 2 || pragaCurrentY > areaAlvoPragaY + areaAlvoPragaAltura - pragaTamanhoBase / 2) {
            pragaMoveDirectionY *= -1;
        }
    } else if (pragaTipo === 'espalhando') {
        // A praga "espalha" criando novos pontos não pulverizados (se já tiver sido pulverizada em algum lugar)
        if (millis() - pragaEspalhandoTimer > PRAGA_ESPALHANDO_INTERVAL) {
            pragaEspalhandoTimer = millis();
            let newX = random(areaAlvoPragaX, areaAlvoPragaX + areaAlvoPragaLargura);
            let newY = random(areaAlvoPragaY, areaAlvoPragaY + areaAlvoPragaAltura);

            let col = floor((newX - areaAlvoPragaX) / PRAGA_GRID_SIZE);
            let row = floor((newY - areaAlvoPragaY) / PRAGA_GRID_SIZE);

            if (col >= 0 && col < gridCols && row >= 0 && row < gridRows && pragaGrid[row][col]) {
                // Se o ponto já está pulverizado, "despulveriza"
                pragaGrid[row][col] = false;
                pixelsPulverizados--;
                // Remove o "spray" visualmente também
                mapaPulverizacao.erase(); // Começa a apagar
                mapaPulverizacao.ellipse(newX, newY, PRAGA_GRID_SIZE * 2, PRAGA_GRID_SIZE * 2);
                mapaPulverizacao.noErase(); // Para de apagar
            } else if (col >= 0 && col < gridCols && row >= 0 && row < gridRows && !pragaGrid[row][col]) {
                // Caso contrário, "espalha" para um ponto adjacente não pulverizado
                let adjacentCols = [-1, 0, 1];
                let adjacentRows = [-1, 0, 1];
                let spread = false;
                for (let dc of adjacentCols) {
                    for (let dr of adjacentRows) {
                        if (dc === 0 && dr === 0) continue;
                        let neighborCol = col + dc;
                        let neighborRow = row + dr;
                        if (neighborCol >= 0 && neighborCol < gridCols && neighborRow >= 0 && neighborRow < gridRows && !pragaGrid[neighborRow][neighborCol]) {
                            // Marca como não pulverizado (volta a ser um problema)
                            pragaGrid[neighborRow][neighborCol] = false;
                            pixelsPulverizados--;
                            spread = true;
                            break;
                        }
                    }
                    if (spread) break;
                }
            }
        }
    }

    // Exibe o progresso da pulverização
    let progressoPulverizacao = pixelsPulverizados / totalPixelsAlvo;
    fill(0);
    textSize(24);
    text(`Pulverizado: ${floor(progressoPulverizacao * 100)}%`, width / 2, 50);
    text(`Spray: ${floor(tanquePulverizacao)}%`, width / 2, 80);

    // Condição de sucesso/falha
    if (progressoPulverizacao >= pragaEliminadaThreshold) {
        finalizarMinigamePraga(true);
    } else if (tanquePulverizacao <= 0 && mouseIsPressed) { // Se acabar o spray e continuar tentando
        finalizarMinigamePraga(false);
    }

    // Exibe tempo restante do minigame
    let tempoDecorrido = (millis() - minigamePragaStartTime) / 1000;
    let tempoRestanteMinigame = TEMPO_MINIGAME_PRAGA - tempoDecorrido;
    fill(0);
    textSize(20);
    text(`Tempo: ${floor(tempoRestanteMinigame)}s`, width - 100, 50);
}

function finalizarMinigamePraga(sucesso) {
    clearTimeout(minigamePragaTimeoutId); // Limpa o timer para evitar chamadas múltiplas
    estadoJogo = 'jogando';
    if (sucesso) {
        score += 50; // Recompensa por sucesso
        saudeFazenda = min(100, saudeFazenda + 10); // Aumenta um pouco a saúde da fazenda
        mostrarFeedback("PRAGA ELIMINADA! +50 Pontos", 0, 200, 0);
    } else {
        score = max(0, score - 20); // Penalidade por falha
        saudeFazenda = max(0, saudeFazenda - 15); // Perde mais saúde
        mostrarFeedback("FALHA NA PULVERIZAÇÃO! -20 Pontos", 255, 0, 0);
    }
    // Remove o problema que foi interagido
    problemas = problemas.filter(p => p !== problemaAtual);
    problemaAtual = null; // Limpa a referência
    resetarMinigamePraga(); // Reseta variáveis do minigame
}

function resetarMinigamePraga() {
    mapaPulverizacao.clear();
    tanquePulverizacao = 100;
    pixelsPulverizados = 0;
    pragaCorpoAlpha = 255;
    pragaEliminadaEfeito = false;
    pragaEspalhandoTimer = 0;
    pragaGrid = null;
}

// ===============================================
// Funções Minigame Seca (Aprimoradas - AGORA COM FLOR!)
// ===============================================

function iniciarMinigameSeca() {
    minigameSecaStartTime = millis();
    barraAguaY = height * 0.8; // Posição inicial da barra
    barraAguaDirecao = random([-1, 1]); // Começa subindo ou descendo
    velocidadeBarraAgua = 5; // Reseta a velocidade
    zonaAlvoAguaY = random(height * 0.3, height * 0.7); // Posição inicial da zona alvo
    acertosSeca = 0;
    falhasConsecutivasSeca = 0;
    plantaEstagioFlor = 0; // Começa como planta murcha (estágio 0)
    irrigacaoEfeitoTimer = 0;

    let tiposZona = ['fixa', 'movel', 'aleatoria'];
    zonaAlvoTipo = random(tiposZona);
    if (zonaAlvoTipo === 'movel') {
        zonaAlvoAguaVelocidade = random(1.0, 3.0);
        zonaAlvoAguaDirecao = random([-1, 1]);
    }


    minigameSecaTimeoutId = setTimeout(() => {
        finalizarMinigameSeca(false);
    }, TEMPO_MINIGAME_SECA * 1000);
}

function executarMinigameSeca() {
    background(150, 100, 50); // Fundo de terra seca

    // Desenha a planta/flor de acordo com o estágio
    drawPlantFlower(width / 2, height * 0.7, plantaEstagioFlor);

    // Desenha a barra de água
    fill(0, 150, 255); // Cor da água
    rect(width * 0.2, barraAguaY, 30, 80); // Barra de água

    // Move a barra de água
    barraAguaY += barraAguaDirecao * velocidadeBarraAgua;
    if (barraAguaY < height * 0.1 || barraAguaY > height * 0.9 - 80) { // Limites da tela
        barraAguaDirecao *= -1;
    }

    // Desenha a zona alvo
    fill(255, 255, 0, 100 + sin(frameCount * 0.1) * 50); // Amarelo pulsante e transparente
    rect(width * 0.2 - 20, zonaAlvoAguaY, 70, zonaAlvoAguaAltura);

    // Move a zona alvo se for tipo 'movel'
    if (zonaAlvoTipo === 'movel') {
        zonaAlvoAguaY += zonaAlvoAguaDirecao * zonaAlvoAguaVelocidade;
        if (zonaAlvoAguaY < height * 0.2 || zonaAlvoAguaY > height * 0.8 - zonaAlvoAguaAltura) {
            zonaAlvoAguaDirecao *= -1;
        }
    }

    // Efeito visual de irrigação
    if (irrigacaoEfeitoTimer > 0) {
        for (let i = 0; i < 10; i++) {
            sprayParticleSystem.addParticle(width / 2 + random(-20, 20), height * 0.7 - 50 + random(-20, 20)); // Ajuste Y para sair da flor
            // Partículas azuis para água
            sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].fill = color(0, 100, 255, 200);
            sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].size = random(3, 8);
        }
        irrigacaoEfeitoTimer--;
    }


    // Exibe status do minigame
    fill(0);
    textSize(24);
    text(`Acertos: ${acertosSeca}`, width / 2, 50);
    text(`Estágio Flor: ${plantaEstagioFlor}/${MAX_ESTAGIOS_FLOR}`, width / 2, 80);

    let tempoDecorrido = (millis() - minigameSecaStartTime) / 1000;
    let tempoRestanteMinigame = TEMPO_MINIGAME_SECA - tempoDecorrido;
    fill(0);
    textSize(20);
    text(`Tempo: ${floor(tempoRestanteMinigame)}s`, width - 100, 50);

    // Condição de sucesso/falha
    if (plantaEstagioFlor >= MAX_ESTAGIOS_FLOR) { // Sucesso se a flor estiver completa
        finalizarMinigameSeca(true);
    } else if (falhasConsecutivasSeca >= 3 || (plantaEstagioFlor <= 0 && acertosSeca > 0)) { // Se a planta murchar totalmente ou falhar 3x
        finalizarMinigameSeca(false);
    }
}

// NOVO: Função para desenhar a planta/flor com base no estágio
function drawPlantFlower(x, y, stage) {
    push();
    translate(x, y);
    noStroke();

    // Tronco da planta
    fill(80, 50, 0); // Marrom
    rect(-5, -100, 10, 100);

    // Dependendo do estágio, desenha a planta/flor
    if (stage === 0) { // Murcha
        // Folhas secas e caídas
        fill(100, 70, 0); // Marrom mais claro
        ellipse(0, -95, 30, 40); // Base murcha
        beginShape();
        vertex(-20, -70);
        bezierVertex(-35, -50, -30, -30, -10, -40);
        endShape(CLOSE);
        beginShape();
        vertex(20, -70);
        bezierVertex(35, -50, 30, -30, 10, -40);
        endShape(CLOSE);
        fill(80, 40, 0); // Sombra para profundidade
        ellipse(0, -90, 20, 25);
    } else if (stage === 1) { // Broto
        // Um pequeno broto verde surgindo
        fill(60, 180, 60); // Verde claro vibrante
        ellipse(0, -95, 25, 35); // Corpo do broto
        // Pequenas folhas iniciais
        triangle(-10, -80, 0, -100, 5, -85);
        triangle(10, -80, 0, -100, -5, -85);
        fill(40, 150, 40); // Sombra
        ellipse(0, -90, 15, 20);
    } else if (stage === 2) { // Pequena flor
        // Broto mais desenvolvido com o início da flor
        fill(70, 200, 70); // Verde mais maduro
        ellipse(0, -90, 35, 45); // Base da planta

        // Primeiras pétalas
        let petalColor = color(255, 150, 200); // Rosa suave
        fill(petalColor);
        ellipse(0, -115, 20, 25); // Uma pétala principal
        rotate(PI / 2);
        ellipse(0, -115, 20, 25);
        rotate(PI / 2);
        ellipse(0, -115, 20, 25);
        rotate(PI / 2);
        ellipse(0, -115, 20, 25);
        rotate(PI / 2); // Volta a rotação para o padrão

        // Miolo pequeno
        fill(255, 220, 0); // Amarelo
        ellipse(0, -115, 10, 10);
        
        // Folhas laterais
        fill(60, 180, 60);
        ellipse(-20, -70, 15, 30);
        ellipse(20, -70, 15, 30);
    } else if (stage === 3) { // Flor média
        // Mais pétalas e cores vibrantes
        fill(80, 220, 80); // Verde vibrante
        ellipse(0, -80, 45, 55); // Base da planta maior

        // Pétalas mais numerosas e definidas
        let petalColor = color(255, 100, 180); // Rosa mais forte
        fill(petalColor);
        for (let i = 0; i < 6; i++) {
            push();
            rotate(i * PI / 3); // 6 pétalas
            ellipse(0, -125, 30, 40); // Pétalas ovais
            pop();
        }

        // Miolo maior e mais detalhado
        fill(255, 200, 0); // Amarelo dourado
        ellipse(0, -125, 20, 20);
        fill(200, 150, 0); // Detalhe no miolo
        ellipse(0, -125, 8, 8);

        // Folhas laterais maiores
        fill(70, 200, 70);
        ellipse(-30, -60, 20, 40);
        ellipse(30, -60, 20, 40);

    } else if (stage === 4) { // Flor quase completa
        // Flor com muitas pétalas e cores intensas
        fill(90, 240, 90); // Verde bem vivo
        ellipse(0, -70, 55, 65); // Base robusta

        // Pétalas exuberantes e sobrepostas
        let petalColor = color(255, 50, 150); // Rosa escuro / Magenta
        fill(petalColor);
        for (let i = 0; i < 8; i++) {
            push();
            rotate(i * PI / 4); // 8 pétalas
            ellipse(0, -140, 40, 55);
            pop();
        }
        fill(petalColor.levels[0], petalColor.levels[1], petalColor.levels[2], 200); // Algumas pétalas mais escuras
        for (let i = 0; i < 4; i++) {
            push();
            rotate(i * PI / 2 + PI / 8); // Pétalas entre as principais
            ellipse(0, -135, 30, 45);
            pop();
        }


        // Miolo grande e vibrante
        fill(255, 180, 0); // Laranja-amarelado
        ellipse(0, -140, 30, 30);
        fill(200, 100, 0); // Centro do miolo
        ellipse(0, -140, 12, 12);

        // Folhas bem desenvolvidas
        fill(80, 220, 80);
        ellipse(-35, -50, 25, 50);
        ellipse(35, -50, 25, 50);

    } else if (stage === 5) { // Flor completa (desabrochada)
        // A flor em sua plenitude, com muitos detalhes e vivacidade
        fill(100, 255, 100); // Verde mais brilhante
        ellipse(0, -60, 65, 75); // Base máxima

        // Muitas pétalas, sobrepostas para dar volume
        let petalColor = color(255, 0, 100); // Fúcsia vibrante
        fill(petalColor);
        for (let i = 0; i < 10; i++) {
            push();
            rotate(i * TWO_PI / 10);
            ellipse(0, -160, 50, 70); // Pétalas alongadas e grandes
            pop();
        }
        fill(255, 50, 120, 200); // Sombra para as pétalas
        for (let i = 0; i < 10; i++) {
            push();
            rotate(i * TWO_PI / 10 + PI / 10);
            ellipse(0, -155, 40, 60);
            pop();
        }

        // Miolo detalhado com estames
        fill(255, 215, 0); // Ouro para o miolo
        ellipse(0, -160, 40, 40);
        fill(255, 165, 0); // Laranja para o centro
        ellipse(0, -160, 15, 15);

        // Estames (pontos)
        fill(200, 150, 0);
        for (let i = 0; i < 12; i++) {
            let angle = i * TWO_PI / 12;
            let radius = 15;
            ellipse(radius * cos(angle), -160 + radius * sin(angle), 5, 5);
        }

        // Folhas grandes e saudáveis
        fill(90, 240, 90);
        beginShape(); // Folha curvada 1
        vertex(-40, -30);
        bezierVertex(-60, 0, -40, 40, -10, 30);
        bezierVertex(-20, 0, -20, -10, -40, -30);
        endShape(CLOSE);

        beginShape(); // Folha curvada 2
        vertex(40, -30);
        bezierVertex(60, 0, 40, 40, 10, 30);
        bezierVertex(20, 0, 20, -10, 40, -30);
        endShape(CLOSE);
    }

    pop();
}


function finalizarMinigameSeca(sucesso) {
    clearTimeout(minigameSecaTimeoutId);
    estadoJogo = 'jogando';
    if (sucesso) {
        score += 50;
        saudeFazenda = min(100, saudeFazenda + 10);
        mostrarFeedback("SECA COMBATIDA! +50 Pontos", 0, 200, 0);
    } else {
        score = max(0, score - 20);
        saudeFazenda = max(0, saudeFazenda - 15);
        mostrarFeedback("FALHA NA IRRIGAÇÃO! -20 Pontos", 255, 0, 0);
    }
    problemas = problemas.filter(p => p !== problemaAtual);
    problemaAtual = null;
    resetarMinigameSeca();
}

function resetarMinigameSeca() {
    barraAguaY = 0;
    barraAguaDirecao = 1;
    velocidadeBarraAgua = 5;
    zonaAlvoAguaY = 0;
    acertosSeca = 0;
    falhasConsecutivasSeca = 0;
    plantaEstagioFlor = 0; // Garante que a planta volte a ser murcha para o próximo minigame
    irrigacaoEfeitoTimer = 0;
}

// ===============================================
// Funções Minigame Colheita (REFORMULADO)
// ===============================================

function iniciarMinigameColheita() {
    minigameColheitaStartTime = millis();
    colheitadeira.x = width / 2; // Reposiciona a colheitadeira
    colheitadeira.y = height * 0.7; // Posição inicial na plantação
    capacidadeAtualArmazem = 0;
    graosNaPlantacao = []; // Limpa grãos antigos
    hasteQuebrada = false;
    hasteReparoTimer = 0;
    hasteColheitaAtiva = false; // Começa desativada

    // Gera grãos dispersos na plantação
    for (let i = 0; i < 50; i++) { // Número de grãos
        let graoType;
        let r = random(1);
        if (r < 0.7) graoType = 'normal';
        else if (r < 0.85) graoType = 'ouro';
        else if (r < 0.95) graoType = 'podre';
        else graoType = 'pedra';

        // Garante que os grãos apareçam dentro das "fileiras de plantação"
        let randomRow = floor(random(0, (height * 0.7 - height * 0.3) / 70)); // Seleciona uma das faixas
        let graoY = height * 0.3 + randomRow * 70 + random(0, 50);
        
        graosNaPlantacao.push(new Grao(random(width * 0.1, width * 0.9), graoY, graoType));
    }

    minigameColheitaTimeoutId = setTimeout(() => {
        finalizarMinigameColheita(false); // Falha se o tempo acabar
    }, TEMPO_MINIGAME_COLHEITA * 1000);
}

function executarMinigameColheita() {
    background(180, 200, 100); // Fundo de plantação

    // Desenha as fileiras da plantação
    fill(150, 180, 80);
    for(let y = height * 0.3; y < height * 0.8; y += 70) {
        rect(0, y, width, 50); // Faixas de plantação
    }

    // Desenha o armazém no canto superior da tela (ou outro lugar adequado para a colheitadeira)
    fill(100, 70, 0); // Cor de madeira/silo
    rect(armazemX - armazemLargura / 2, armazemY, armazemLargura, armazemAltura, 10);
    fill(150, 100, 50); // Telhado
    triangle(armazemX - armazemLargura / 2, armazemY, armazemX + armazemLargura / 2, armazemY, armazemX, armazemY - 40);
    fill(255);
    textSize(18);
    text(`Armazém: ${capacidadeAtualArmazem}/${CAPACIDADE_MAXIMA_ARMAZEM}`, armazemX, armazemY + armazemAltura + 20);

    // Desenha o medidor visual do armazém
    let fillHeight = map(capacidadeAtualArmazem, 0, CAPACIDADE_MAXIMA_ARMAZEM, 0, armazemAltura);
    fill(255, 215, 0, 150); // Cor dos grãos no armazém
    rect(armazemX - armazemLargura / 2, armazemY + armazemAltura - fillHeight, armazemLargura, fillHeight);


    // Atualiza e desenha a colheitadeira
    colheitadeira.update();
    colheitadeira.display(); // A colheitadeira já tem sua lógica de display

    // Desenha a haste de colheita na frente da colheitadeira
    push();
    translate(colheitadeira.x, colheitadeira.y + colheitadeira.altura / 2); // Origem na parte inferior da colheitadeira
    if (!hasteQuebrada) {
        stroke(100, 50, 0); // Cor da haste (metal/ferrugem)
        strokeWeight(5);
        // Haste horizontal na frente
        line(-HASTE_LARGURA / 2, 0, HASTE_LARGURA / 2, 0);
        // Parte vertical que desce para colher
        line(0, 0, 0, HASTE_COMPRIMENTO);

        if (hasteColheitaAtiva) {
            // Efeito de movimento da haste
            fill(200, 150, 0, 180); // Lâminas girando
            rect(-HASTE_LARGURA / 2, HASTE_COMPRIMENTO - 10, HASTE_LARGURA, 20);
            for(let i = -HASTE_LARGURA / 2; i <= HASTE_LARGURA / 2; i += 20) {
                line(i, HASTE_COMPRIMENTO - 10, i, HASTE_COMPRIMENTO + 10);
            }
        }
        noStroke();
    } else {
        // Haste quebrada visual
        stroke(100, 50, 0); // Cor enferrujada/quebrada
        strokeWeight(4);
        line(-HASTE_LARGURA / 4, 0, -HASTE_LARGURA / 2 + 10, HASTE_COMPRIMENTO / 2);
        line(HASTE_LARGURA / 4, 0, HASTE_LARGURA / 2 - 10, HASTE_COMPRIMENTO / 2);
        fill(255, 0, 0, 150 + sin(frameCount * 0.1) * 50);
        ellipse(0, HASTE_COMPRIMENTO / 2, 20, 20); // Ícone de "X" ou fumaça
        fill(255, 100, 0);
        textSize(16);
        text("HASTE QUEBRADA!", 0, HASTE_COMPRIMENTO + 20);
    }
    pop();


    // Desenha e verifica grãos na plantação
    for (let i = graosNaPlantacao.length - 1; i >= 0; i--) {
        let grao = graosNaPlantacao[i];
        grao.display(); // Grãos não se movem, apenas são desenhados

        // Calcula a área da haste de colheita
        let hasteMinX = colheitadeira.x - HASTE_LARGURA / 2;
        let hasteMaxX = colheitadeira.x + HASTE_LARGURA / 2;
        let hasteMinY = colheitadeira.y + colheitadeira.altura / 2;
        let hasteMaxY = colheitadeira.y + colheitadeira.altura / 2 + HASTE_COMPRIMENTO;


        // Verifica colisão da haste com os grãos/pedras
        if (hasteColheitaAtiva && !hasteQuebrada &&
            grao.x > hasteMinX && grao.x < hasteMaxX &&
            grao.y > hasteMinY && grao.y < hasteMaxY)
        {
            if (grao.tipo === 'normal') {
                capacidadeAtualArmazem++;
                score += PONTOS_GRAO_NORMAL;
                mostrarFeedback("+5", 0, 200, 0);
            } else if (grao.tipo === 'ouro') {
                capacidadeAtualArmazem += 2; // Ouro vale 2 unidades de espaço
                score += PONTOS_GRAO_OURO;
                mostrarFeedback("✨ +15!", 255, 215, 0);
            } else if (grao.tipo === 'podre') {
                score = max(0, score - PENALIDADE_GRAO_PODRE);
                saudeFazenda = max(0, saudeFazenda - 5);
                mostrarFeedback("-5", 255, 0, 0);
            } else if (grao.tipo === 'pedra') {
                score = max(0, score - PENALIDADE_GRAO_PEDRA);
                saudeFazenda = max(0, saudeFazenda - 10);
                mostrarFeedback("💥 -10!", 255, 0, 0);
                if (random(100) < DANO_PEDRA_HASTE) { // Chance de danificar
                    hasteQuebrada = true;
                    hasteColheitaAtiva = false; // Desativa a haste
                    hasteReparoTimer = HASTE_TEMPO_REPARO * 1000; // Inicia o timer de reparo
                    mostrarFeedback("HASTE QUEBROU!", 255, 100, 0);
                }
            }
            graosNaPlantacao.splice(i, 1); // Remove o grão
            colheitaEfeitoTimer = 10; // Ativa efeito visual
        }
    }

    // Lógica de reparo da haste
    if (hasteQuebrada) {
        hasteReparoTimer -= deltaTime;
        if (hasteReparoTimer <= 0) {
            hasteQuebrada = false;
            mostrarFeedback("HASTE REPARADA!", 0, 200, 0);
        }
    }

    // Efeito de coleta (partículas)
    if (colheitaEfeitoTimer > 0) {
        for (let i = 0; i < 5; i++) {
            // Partículas saindo da haste para cima
            sprayParticleSystem.addParticle(colheitadeira.x + random(-HASTE_LARGURA / 2, HASTE_LARGURA / 2), colheitadeira.y + colheitadeira.altura / 2 + HASTE_COMPRIMENTO + random(-5, 5));
            // Partículas amarelas para grãos
            sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].fill = color(255, 200, 0, 200);
            sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].size = random(2, 6);
            sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].vy = random(-2, -0.5); // Sobem
        }
        colheitaEfeitoTimer--;
    }


    // Exibe status
    fill(0);
    textSize(24);
    text(`Score: ${score}`, width / 2, 50);
    text(`Haste: ${hasteQuebrada ? 'Quebrada' : 'OK'}`, width / 2, 80);
    if (hasteQuebrada) {
        fill(255, 0, 0);
        text(`Reparo em: ${ceil(hasteReparoTimer / 1000)}s`, width / 2, 110);
    }


    let tempoDecorrido = (millis() - minigameColheitaStartTime) / 1000;
    let tempoRestanteMinigame = TEMPO_MINIGAME_COLHEITA - tempoDecorrido;
    fill(0);
    textSize(20);
    text(`Tempo: ${floor(tempoRestanteMinigame)}s`, width - 100, 50);

    // Condição de sucesso/falha
    if (capacidadeAtualArmazem >= CAPACIDADE_MAXIMA_ARMAZEM) {
        finalizarMinigameColheita(true);
    } else if (tempoRestanteMinigame <= 0 && capacidadeAtualArmazem < CAPACIDADE_MAXIMA_ARMAZEM) {
        // Se o tempo acabar e não tiver colhido o suficiente
        finalizarMinigameColheita(false);
    }
}

function finalizarMinigameColheita(sucesso) {
    clearTimeout(minigameColheitaTimeoutId);
    estadoJogo = 'jogando';
    if (sucesso) {
        score += 70;
        saudeFazenda = min(100, saudeFazenda + 15);
        mostrarFeedback("COLHEITA COMPLETA! +70 Pontos", 0, 200, 0);
    } else {
        score = max(0, score - 30);
        saudeFazenda = max(0, saudeFazenda - 20);
        mostrarFeedback("FALHA NA COLHEITA! -30 Pontos", 255, 0, 0);
    }
    problemas = problemas.filter(p => p !== problemaAtual);
    problemaAtual = null;
    resetarMinigameColheita();
    // Reposiciona o drone para o centro da tela principal ao sair do minigame
    drone.x = width / 2;
    drone.y = height / 2;
}

function resetarMinigameColheita() {
    capacidadeAtualArmazem = 0;
    graosNaPlantacao = [];
    hasteQuebrada = false;
    hasteReparoTimer = 0;
    colheitaEfeitoTimer = 0;
    hasteColheitaAtiva = false;
}

// ===============================================
// Funções Minigame Doença (Aprimoradas)
// ===============================================

function iniciarMinigameDoenca() {
    minigameDoencaStartTime = millis();
    focosRestantesDoenca = [];
    dosesAntidoto = DOSES_INICIAIS_ANTIDOTO;
    doencaEliminadaEfeito = false;
    nevoaAlpha = 0; // Começa sem névoa, ela aumenta

    // Gera 3-6 focos de doença aleatórios com tipos variados
    let numFocos = floor(random(3, 7));
    const tiposFoco = ['estacionario', 'movel', 'pulsante', 'contagioso'];
    for (let i = 0; i < numFocos; i++) {
        let fx = random(50, width - 50);
        let fy = random(50, height - 50);
        let tipoFoco = random(tiposFoco);
        focosRestantesDoenca.push({
            x: fx,
            y: fy,
            tamanho: random(30, 50),
            tratado: false,
            tipo: tipoFoco,
            pulseOffset: random(TWO_PI), // Para focos pulsantes
            moveDirectionX: random([-1, 1]), // Para focos móveis
            moveDirectionY: random([-1, 1]),
            lastContagionTime: millis() // Para focos contagiosos
        });
    }

    minigameDoencaTimeoutId = setTimeout(() => {
        finalizarMinigameDoenca(false);
    }, TEMPO_MINIGAME_DOENCA * 1000);
}

function executarMinigameDoenca() {
    background(80, 120, 80); // Fundo de campo doente

    // Move o drone dentro do minigame
    drone.update();
    drone.display();

    // Atualiza e desenha focos de doença
    for (let i = focosRestantesDoenca.length - 1; i >= 0; i--) {
        let foco = focosRestantesDoenca[i];

        // Animação de desaparecimento de focos tratados
        if (foco.tratado) {
            foco.tamanho = max(0, foco.tamanho - 1);
            if (foco.tamanho <= 0) {
                focosRestantesDoenca.splice(i, 1);
                continue; // Pula para o próximo foco
            }
        }

        // Lógica de movimento e pulsação para focos não tratados
        if (!foco.tratado) {
            if (foco.tipo === 'movel') {
                foco.x += foco.moveDirectionX * focoMoveSpeed;
                foco.y += foco.moveDirectionY * focoMoveSpeed;

                // Inverte direção ao atingir as bordas
                if (foco.x < 20 || foco.x > width - 20) foco.moveDirectionX *= -1;
                if (foco.y < 20 || foco.y > height - 20) foco.moveDirectionY *= -1;
            } else if (foco.tipo === 'pulsante') {
                foco.tamanho = map(sin(frameCount * 0.1 + foco.pulseOffset), -1, 1, 30, 55); // Pulsação de tamanho
            } else if (foco.tipo === 'contagioso') {
                // Foco contagioso tenta infectar áreas próximas
                if (millis() - foco.lastContagionTime > 3000) { // A cada 3 segundos tenta espalhar
                    foco.lastContagionTime = millis();
                    let newFocoX = foco.x + random(-70, 70);
                    let newFocoY = foco.y + random(-70, 70);

                    // Garante que o novo foco não está fora da tela e não está muito próximo de um foco existente não tratado
                    let tooClose = false;
                    for (let otherFoco of focosRestantesDoenca) {
                        if (!otherFoco.tratado && dist(newFocoX, newFocoY, otherFoco.x, otherFoco.y) < 60) {
                            tooClose = true;
                            break;
                        }
                    }

                    if (!tooClose && focosRestantesDoenca.length < MAX_PROBLEMAS_ATIVOS * 2) { // Limita o total de focos
                        // 50% de chance de criar um novo foco, 50% de chance de "reinfetar" um tratado próximo (se houver)
                        if (random(1) < 0.5) {
                            focosRestantesDoenca.push({
                                x: newFocoX,
                                y: newFocoY,
                                tamanho: random(20, 40),
                                tratado: false,
                                tipo: random(['estacionario', 'movel', 'pulsante']), // Novos focos podem ser de outros tipos
                                pulseOffset: random(TWO_PI),
                                moveDirectionX: random([-1, 1]),
                                moveDirectionY: random([-1, 1]),
                                lastContagionTime: millis()
                            });
                             mostrarFeedback("DOENÇA SE ESPALHOU!", 255, 100, 0);
                        } else {
                            // Tenta reinfetar um foco tratado próximo
                            let reinfecaoSucesso = false;
                            for (let otherFoco of focosRestantesDoenca) {
                                if (otherFoco.tratado && dist(foco.x, foco.y, otherFoco.x, otherFoco.y) < 100) {
                                    otherFoco.tratado = false;
                                    otherFoco.tamanho = otherFoco.tamanho < 30 ? 30 : otherFoco.tamanho; // Garante tamanho mínimo
                                    reinfecaoSucesso = true;
                                    mostrarFeedback("FOCO REINFECTADO!", 255, 50, 50);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }


        // Desenha o foco
        push();
        translate(foco.x, foco.y);
        noStroke();
        
        // Efeito de vibração para focos não tratados
        if (!foco.tratado) {
            let shakeX = random(-2, 2);
            let shakeY = random(-2, 2);
            translate(shakeX, shakeY);
            fill(150, 0, 0, 200 + sin(frameCount * 0.1) * 50); // Cor vermelha pulsante
        } else {
            fill(150, 0, 0, 200); // Cor normal se tratado (antes de desaparecer)
        }
        
        ellipse(0, 0, foco.tamanho);

        // Ícone da doença
        fill(255);
        textSize(foco.tamanho * 0.6);
        text("🦠", 0, 0);

        // Efeito visual de antídoto sendo aplicado
        if (doencaEliminadaEfeito && dist(drone.x, drone.y, foco.x, foco.y) < 40 && foco.tratado) { // Só ativa se o foco foi tratado
            for (let j = 0; j < 5; j++) {
                sprayParticleSystem.addParticle(foco.x + random(-10, 10), foco.y + random(-10, 10));
                sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].fill = color(0, 255, 255, 200); // Azul ciano para antídoto
                sprayParticleSystem.particles[sprayParticleSystem.particles.length - 1].size = random(5, 12);
            }
        }
        pop();
    }

    // Dano à fazenda se focos não tratados
    let focosNaoTratados = focosRestantesDoenca.filter(f => !f.tratado).length;
    if (focosNaoTratados > 0) {
        saudeFazenda -= (focosNaoTratados * FOCO_DANO_POR_SEGUNDO) * (deltaTime / 1000);
        saudeFazenda = max(0, saudeFazenda);
    }

    // Desenha a névoa da doença
    nevoaAlpha += nevoaDirection * NEVOA_PULSE_SPEED;
    if (nevoaAlpha > NEVOA_MAX_ALPHA || nevoaAlpha < 0) {
        nevoaDirection *= -1;
    }
    fill(50, 0, 50, nevoaAlpha); // Névoa roxa escura
    rect(0, 0, width, height);

    // Exibe status do minigame
    fill(0);
    textSize(24);
    text(`Focos Restantes: ${focosRestantesDoenca.filter(f => !f.tratado).length}`, width / 2, 50);
    text(`Doses Antídoto: ${dosesAntidoto}`, width / 2, 80);

    // Barra visual de doses
    fill(0, 100, 200); // Azul para as doses
    let doseWidth = (width - 40) / DOSES_INICIAIS_ANTIDOTO;
    for (let i = 0; i < dosesAntidoto; i++) {
        rect(20 + i * doseWidth, height - 40, doseWidth - 5, 20);
    }

    let tempoDecorrido = (millis() - minigameDoencaStartTime) / 1000;
    let tempoRestanteMinigame = TEMPO_MINIGAME_DOENCA - tempoDecorrido;
    fill(0);
    textSize(20);
    text(`Tempo: ${floor(tempoRestanteMinigame)}s`, width - 100, 50);

    // Condição de sucesso/falha
    if (focosRestantesDoenca.every(f => f.tratado)) {
        finalizarMinigameDoenca(true);
    } else if (dosesAntidoto <= 0 && focosRestantesDoenca.some(f => !f.tratado)) {
        finalizarMinigameDoenca(false);
    }
}

function finalizarMinigameDoenca(sucesso) {
    clearTimeout(minigameDoencaTimeoutId);
    estadoJogo = 'jogando';
    if (sucesso) {
        score += 60;
        saudeFazenda = min(100, saudeFazenda + 10);
        mostrarFeedback("DOENÇA COMBATIDA! +60 Pontos", 0, 200, 0);
    } else {
        score = max(0, score - 25);
        saudeFazenda = max(0, saudeFazenda - 20);
        mostrarFeedback("FALHA NO TRATAMENTO! -25 Pontos", 255, 0, 0);
    }
    problemas = problemas.filter(p => p !== problemaAtual);
    problemaAtual = null;
    resetarMinigameDoenca();
}

function resetarMinigameDoenca() {
    focosRestantesDoenca = [];
    dosesAntidoto = DOSES_INICIAIS_ANTIDOTO;
    doencaEliminadaEfeito = false;
    nevoaAlpha = 0;
    nevoaDirection = 1;
}