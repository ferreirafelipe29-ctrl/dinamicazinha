// Elementos da interface
const forceInput = document.getElementById('force');
const massInput = document.getElementById('mass');
const forceVal = document.getElementById('force-val');
const massVal = document.getElementById('mass-val');
const accVal = document.getElementById('acc-val');
const velVal = document.getElementById('vel-val');

const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const box = document.getElementById('box');
const track = document.getElementById('track');

// Variáveis da física
let position = 0;
let velocity = 0;
let acceleration = 0;
let isRunning = false;
let animationId = null;
let lastTime = null;

// Atualiza os cálculos de física baseados nos sliders
function updatePhysics() {
  const force = parseFloat(forceInput.value);
  const mass = parseFloat(massInput.value);

  // F = m * a  =>  a = F / m
  acceleration = force / mass;

  // Atualiza textos na tela
  forceVal.textContent = force;
  massVal.textContent = mass;
  accVal.textContent = acceleration.toFixed(2);
}

// Loop de animação
function animate(time) {
  if (!lastTime) lastTime = time;
  const dt = (time - lastTime) / 1000; // Converte milissegundos para segundos
  lastTime = time;

  if (isRunning) {
    // Atualiza velocidade: v = v0 + a * t
    velocity += acceleration * dt;
    // Atualiza posição: S = S0 + v * t
    position += velocity * dt * 50; // Factor de escala para visualização em pixels

    // Limite da pista
    const maxPosition = track.clientWidth - box.clientWidth;
    if (position >= maxPosition) {
      position = maxPosition;
      isRunning = false; // Para ao chegar ao final
    }

    // Aplica no elemento HTML
    box.style.left = `${position}px`;
    velVal.textContent = (velocity).toFixed(2);

    animationId = requestAnimationFrame(animate);
  }
}

// Eventos dos Controles
forceInput.addEventListener('input', updatePhysics);
massInput.addEventListener('input', updatePhysics);

btnStart.addEventListener('click', () => {
  isRunning = !isRunning;
  if (isRunning) {
    lastTime = null;
    animationId = requestAnimationFrame(animate);
  }
});

btnReset.addEventListener('click', () => {
  isRunning = false;
  cancelAnimationFrame(animationId);
  position = 0;
  velocity = 0;
  box.style.left = '0px';
  velVal.textContent = '0.00';
  lastTime = null;
});

// Inicialização
updatePhysics();

// Resistência do vidro em Pascals (N/m²)
// Vidro Comum ~ 40,000,000 Pa (40 MPa)
const RESISTENCIA_VIDRO = 40000000; 

function checarRuptura(massa, aceleracao, areaContatoMetrosQuadrados) {
  const forca = massa * aceleracao; // F = m * a
  const pressaoExercida = forca / areaContatoMetrosQuadrados; // P = F / A

  if (pressaoExercida >= RESISTENCIA_VIDRO) {
    return { quebrou: true, pressao: pressaoExercida };
  }
  return { quebrou: false, pressao: pressaoExercida };
}

.cenario {
  position: relative;
  width: 100%;
  height: 150px;
  background-color: #f4f4f4;
  border-bottom: 4px solid #333;
  overflow: hidden;
}

// Captura dos elementos HTML
const elBloco = document.getElementById('bloco');
const elVidro = document.getElementById('vidro');
const elResultado = document.getElementById('resultadoImpacto');
const inputTipoVidro = document.getElementById('tipoVidro');
const inputArea = document.getElementById('areaContato');

// Exemplo das suas variáveis de controle existentes
let posicaoBloco = 0;
let velocidade = 0;
let animacaoId = null;

function simularMovimento(massa, forca) {
  // 1. Segunda Lei de Newton: a = F / m
  const aceleracao = forca / massa;

  // 2. Cálculo da Pressão no Impacto: P = F / A
  // Converte área de cm² para m² (dividir por 10.000)
  const areaMetrosQuadrados = parseFloat(inputArea.value) / 10000;
  const pressaoExercida = forca / areaMetrosQuadrados; // em Pascals (Pa)
  const resistenciaVidro = parseFloat(inputTipoVidro.value);

  // Posição onde o impacto acontece (em pixels)
  const limiteImpacto = 300; 

  function atualizarLoop() {
    velocidade += aceleracao * 0.016; // Incremento por frame (~60fps)
    posicaoBloco += velocidade;

    elBloco.style.left = `${posicaoBloco}px`;

    // Checa colisão do bloco com o vidro
    if (posicaoBloco >= limiteImpacto) {
      cancelAnimationFrame(animacaoId);
      processarImpacto(pressaoExercida, resistenciaVidro, forca);
      return;
    }

    animacaoId = requestAnimationFrame(atualizarLoop);
  }

  animacaoId = requestAnimationFrame(atualizarLoop);
}

function processarImpacto(pressao, resistencia, forca) {
  const pressaoMPa = (pressao / 1000000).toFixed(2);
  const resistenciaMPa = (resistencia / 1000000).toFixed(2);

  if (pressao >= resistencia) {
    elVidro.className = 'vidro-quebrado';
    elResultado.innerHTML = `<strong>O VIDRO QUEBROU!</strong><br>
      Pressão aplicada: ${pressaoMPa} MPa | Resistência: ${resistenciaMPa} MPa`;
  } else {
    elVidro.className = 'vidro-intacto';
    elResultado.innerHTML = `<strong>O VIDRO RESISTIU!</strong><br>
      Pressão aplicada: ${pressaoMPa} MPa | Resistência necessária: ${resistenciaMPa} MPa`;
  }
}

// Botão de reset
function resetarSimulacao() {
  cancelAnimationFrame(animacaoId);
  posicaoBloco = 0;
  velocidade = 0;
  elBloco.style.left = '0px';
  elVidro.className = 'vidro-intacto';
  elResultado.textContent = 'Status: Aguardando simulação...';
}
