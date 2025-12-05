const meuTabuleiro = document.getElementById('meu-tabuleiro');
const tabuleiroInimigo = document.getElementById('tabuleiro-inimigo');
const botaoReiniciar = document.querySelector('.restart-btn');

let jogoAcabou = false;
let vezDoJogador = true;
let acertosJogador = 0;
let acertosComputador = 0;
let jogadasComputador = [];

const somExplosao = new Audio('./som/explosion-312361.mp3');

// Criar tabuleiros
function criarTabuleiro(tabuleiro, clicavel) {
    tabuleiro.innerHTML = ''; 
    for (let i = 0; i < 100; i++) {
        const celula = document.createElement('div');
        celula.classList.add('cell');
        if (clicavel) {
            celula.classList.add('clicavel');
            celula.addEventListener('click', () => clicarCelulaInimigo(celula));
        }
        tabuleiro.appendChild(celula);
    }
}

// Inicializar tabuleiros
criarTabuleiro(meuTabuleiro, false);
criarTabuleiro(tabuleiroInimigo, true);

const celulasJogador = document.querySelectorAll('#meu-tabuleiro .cell');
const celulasInimigo = document.querySelectorAll('#tabuleiro-inimigo .cell');

function gerarNavios(tamanhoNavios) {
    let navios = [];
    
    tamanhoNavios.forEach(tamanho => {
        let posicaoValida = false;
        while (!posicaoValida) {
            let inicio = Math.floor(Math.random() * 100);
            let direcao = Math.random() < 0.5 ? 1 : 10; 
            let posicaoNavio = [];

            for (let i = 0; i < tamanho; i++) {
                let celula = inicio + (i * direcao);
                if (celula >= 100 || (direcao === 1 && Math.floor(celula / 10) !== Math.floor(inicio / 10))) {
                    break;
                }
                posicaoNavio.push(celula);
            }

            if (posicaoNavio.length === tamanho && posicaoNavio.every(c => !navios.includes(c))) {
                navios.push(...posicaoNavio);
                posicaoValida = true;
            }
        }
    });

    return navios;
}

let naviosInimigos = gerarNavios([3, 4, 5, 3]); 
let naviosJogador = gerarNavios([3, 4, 5, 3]); 

function tocarSomExplosao() {
    somExplosao.play();
}

// Ataque do jogador
function clicarCelulaInimigo(celula) {
    if (!vezDoJogador || jogoAcabou || celula.classList.contains('destaque') || celula.classList.contains('erro')) return;

    const indice = Array.from(celulasInimigo).indexOf(celula);

    if (naviosInimigos.includes(indice)) {
        celula.classList.add('destaque'); 
        tocarSomExplosao();
        acertosJogador++;
        console.log('Você acertou um navio!');
        if (acertosJogador === naviosInimigos.length) {
            console.log('Você venceu!');
            jogoAcabou = true;
        } else {
            vezDoJogador = false;
            setTimeout(jogadaComputador, 1000);
        }
    } else {
        celula.classList.add('erro'); 
        vezDoJogador = false;
        setTimeout(jogadaComputador, 1000);
    }
}

// Reiniciar jogo
botaoReiniciar.addEventListener('click', () => {
    jogoAcabou = false;
    vezDoJogador = true;
    acertosJogador = 0;
    acertosComputador = 0;
    jogadasComputador = [];

    naviosInimigos = gerarNavios([3, 4, 5, 3]); 
    naviosJogador = gerarNavios([3, 4, 5, 3]); 

    celulasJogador.forEach(c => c.classList.remove('destaque', 'erro'));
    celulasInimigo.forEach(c => c.classList.remove('destaque', 'erro'));
});

function jogadaComputador() {
    if (jogoAcabou) return;

    let celulaAleatoria;
    do {
        const indice = Math.floor(Math.random() * celulasJogador.length);
        celulaAleatoria = celulasJogador[indice];
    } while (jogadasComputador.includes(celulaAleatoria));

    jogadasComputador.push(celulaAleatoria);
    const indice = Array.from(celulasJogador).indexOf(celulaAleatoria);

    if (naviosJogador.includes(indice)) {
        celulaAleatoria.classList.add('destaque');
        tocarSomExplosao(); // Agora a máquina também toca som ao acertar!
        acertosComputador++;
        if (acertosComputador === naviosJogador.length) {
            console.log('A máquina venceu!');
            jogoAcabou = true;
        } else {
            vezDoJogador = true;
        }
    } else {
        celulaAleatoria.classList.add('erro');
        vezDoJogador = true;
    }
}
