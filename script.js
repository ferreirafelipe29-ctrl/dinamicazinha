 // Captura dos elementos do DOM
const forceInput = document.getElementById('force');
const massInput = document.getElementById('mass');
const forceVal = document.getElementById('force-val');
const massVal = document.getElementById('mass-val');
const accVal = document.getElementById('acc-val');
const velVal = document.getElementById('vel-val');

const tipoVidroInput = document.getElementById('tipoVidro');
const areaContatoInput = document.getElementById('areaContato');
const resultadoImpacto = document.getElementById('resultadoImpacto');

const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const box = document.getElementById('box');
const vidro = document.getElementById('vidro');
const track = document.getElementById('track');

// Variáveis da Física e Animação
let position = 0;
let velocity = 0;
let acceleration = 0;
let isRunning = false;
let animationId = null;
let lastTime = null;

// Atualiza a aceleração calculada e a interface
function updatePhysics() {
  const force = parseFloat(forceInput.value);
  const mass = parseFloat(massInput.value);

  // Segunda Lei de Newton: F = m * a => a = F / m
  acceleration = force / mass;

  forceVal.textContent = force;
  massVal.textContent = mass;
  accVal.textContent = acceleration.toFixed(2);
}

// Processa o impacto do bloco no vidro
function processarImpacto() {
  const force = parseFloat(forceInput.value);
  const areaCm2 = parseFloat(areaContatoInput.value) || 1;
  
  // Converte cm² para m² (1 cm² = 0.0001 m²)
  const areaM2 = areaCm2 / 10000;
  
  // Pressão P = F / A (em Pascals)
  const pressaoExercida = force / areaM2;
  const resistenciaVidro = parseFloat(tipoVidroInput.value);

  const pressaoMPa = (pressaoExercida / 1000000).toFixed(2);
  const resistenciaMPa = (resistenciaVidro / 1000000).toFixed(2);

  if (pressaoExercida >= resistenciaVidro) {
    vidro.className = 'vidro-quebrado';
    resultadoImpacto.style.color = '#e74c3c';
    resultadoImpacto.innerHTML = `O VIDRO QUEBROU! Pressão: ${pressaoMPa} MPa | Resistência: ${resistenciaMPa} MPa`;
  } else {
    vidro.className = 'vidro-intacto';
    resultadoImpacto.style.color = '#27ae60';
    resultadoImpacto.innerHTML = `O VIDRO RESISTIU! Pressão: ${pressaoMPa} MPa | Resistência: ${resistenciaMPa} MPa`;
  }
}

// Loop principal de animação
function animate(time) {
  if (!lastTime) lastTime = time;
  const dt = (time - lastTime) / 1000; // Converte ms para segundos
  lastTime = time;

  if (isRunning) {
    // Equações do movimento acelerado: v = v0 + a*t
    velocity += acceleration * dt;
    // Posição (multiplicada por um fator de escala em pixels)
    position += velocity * dt * 60;

    // Posição exata do vidro no cenário
    const vidroOffset = vidro.offsetLeft;
    const boxWidth = box.clientWidth;
    const pontoColisao = vidroOffset - boxWidth;

    // Checa colisão com o vidro
    if (position >= pontoColisao) {
      position = pontoColisao;
      box.style.left = `${position}px`;
      velVal.textContent = velocity.toFixed(2);
      isRunning = false;
      
      processarImpacto();
      return;
    }

    // Aplica a posição atual no estilo CSS
    box.style.left = `${position}px`;
    velVal.textContent = velocity.toFixed(2);

    animationId = requestAnimationFrame(animate);
  }
}

// Resetar estado da simulação
function resetSimulation() {
  isRunning = false;
  cancelAnimationFrame(animationId);
  position = 0;
  velocity = 0;
  lastTime = null;

  box.style.left = '0px';
  velVal.textContent = '0.00';
  vidro.className = 'vidro-intacto';
  resultadoImpacto.style.color = '#333';
  resultadoImpacto.textContent = 'Vidro Intacto';
  
  updatePhysics();
}

// Event Listeners
forceInput.addEventListener('input', updatePhysics);
massInput.addEventListener('input', updatePhysics);

btnStart.addEventListener('click', () => {
  if (position >= vidro.offsetLeft - box.clientWidth) {
    resetSimulation();
  }

  isRunning = !isRunning;
  if (isRunning) {
    lastTime = null;
    animationId = requestAnimationFrame(animate);
  }
});

btnReset.addEventListener('click', resetSimulation);

// Inicializa valores da física ao carregar
updatePhysics();
