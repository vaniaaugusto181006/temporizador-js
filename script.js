// Seleção de elementos
const btnAutoReinicio = document.getElementById('btnAutoReinicio');
let autoReinicioAtivo = true;
if (btnAutoReinicio) {
	btnAutoReinicio.addEventListener('click', function() {
		autoReinicioAtivo = !autoReinicioAtivo;
		this.textContent = autoReinicioAtivo ? '🔄 Reinício Auto: ON' : '⏹️ Reinício Auto: OFF';
		console.log('🔄 Reinício automático:', autoReinicioAtivo ? 'ATIVADO' : 'DESATIVADO');
	});
}
const containerTemporizador = document.querySelector('.temporizador');

function tempoEsgotado() {
	console.log('🎯 Tempo esgotado! Executando ações finais...');

	clearInterval(intervalo);
	rodando = false;
	if (containerTemporizador) {
		containerTemporizador.classList.remove('temporizador-ativo');
	}

	// Tocar som de alerta
	alertaSom.play().catch(error => {
		console.log('❌ Erro ao tocar som:', error);
	});

	// Mostrar alerta visual
	alert('⏰ TEMPO ESGOTADO!\n\nO temporizador será reiniciado automaticamente.');

		// 🔄 REINICIAR SOMENTE SE ESTIVER ATIVO
		if (autoReinicioAtivo) {
			console.log('🔄 Reiniciando temporizador automaticamente...');
			totalSegundos = tempoInicial;
			atualizarDisplay();
			console.log('✅ Temporizador reiniciado. Pronto para usar novamente!');
		}
}
const display = document.getElementById('displayTempo');
const btnIniciar = document.getElementById('btnIniciar');
const btnPausar = document.getElementById('btnPausar');
const btnZerar = document.getElementById('btnZerar');
const btnModoEscuro = document.getElementById('btnModoEscuro');
const inputMinutos = document.getElementById('minutosInput');
const inputSegundos = document.getElementById('segundosInput');
// Variáveis de controle
let totalSegundos = 0;
let tempoInicial = 60; // Guarda o tempo inicial para reinício automático
// Esta variável lembra qual era o tempo original que o usuário definiu
// Assim podemos voltar a ele quando o temporizador terminar
let intervalo = null;
let rodando = false;
// Áudio de alerta
const alertaSom = new Audio('alerta.mp3');
// Atualiza o display
function atualizarDisplay() {
 const minutos = Math.floor(totalSegundos / 60);
 const segundos = totalSegundos % 60;
 display.textContent =
`${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
 console.log('⏱️ Display atualizado:', display.textContent);
}
// Iniciar temporizador
function iniciar() {
	console.log('▶️ Botão Iniciar pressionado');

	if (rodando) {
		console.log('⏳ Temporizador já está rodando');
		return;
	}

		const min = parseInt(inputMinutos.value) || 0;
		const seg = parseInt(inputSegundos.value) || 0;

		console.log('📥 Valores capturados:', { minutos: min, segundos: seg });

		// 🎯 CHAMAR FUNÇÃO DE VALIDAÇÃO
		if (!validarEntrada(min, seg)) {
			console.log('❌ Validação falhou - temporizador não iniciado');
			return; // Impede que o temporizador inicie se a validação falhar
		}

		// ... resto do código para iniciar o temporizador
		totalSegundos = min * 60 + seg;
		tempoInicial = totalSegundos; // ⬅️ LINHA IMPORTANTE!
		console.log('💾 Tempo inicial guardado:', tempoInicial);

		rodando = true;
		if (containerTemporizador) {
			containerTemporizador.classList.add('temporizador-ativo');
		}

		intervalo = setInterval(() => {
			totalSegundos--;
			atualizarDisplay();
			if (totalSegundos <= 0) {
				tempoEsgotado();
				totalSegundos = tempoInicial; // Reinício automático
				atualizarDisplay();
			}
		}, 1000);
}
// Pausar temporizador
function pausar() {
 if (!rodando) return;
 clearInterval(intervalo);
 rodando = false;
 console.log('⏸️ Temporizador pausado');
}
// Resetar temporizador
function zerar() {
 clearInterval(intervalo);
 totalSegundos = 0;
 rodando = false;
 atualizarDisplay();
 console.log('🔄 Temporizador resetado');
}
// Alternar modo escuro

function alternarModoEscuro() {
	console.log('🌙 Alternando modo escuro...');
	document.body.classList.toggle('modo-escuro');
	const estaModoEscuro = document.body.classList.contains('modo-escuro');
	btnModoEscuro.textContent = estaModoEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro';
	localStorage.setItem('modoEscuro', estaModoEscuro);
	console.log('🎨 Modo escuro:', estaModoEscuro ? 'ATIVADO' : 'DESATIVADO');
}
btnModoEscuro.addEventListener('click', alternarModoEscuro);

// 🎯 BÔNUS: LEMBRAR PREFERÊNCIA DO USUÁRIO
function carregarPreferencias() {
	const modoEscuroSalvo = localStorage.getItem('modoEscuro');
	if (modoEscuroSalvo === 'true') {
		document.body.classList.add('modo-escuro');
		btnModoEscuro.textContent = '☀️ Modo Claro';
		console.log('💾 Preferência carregada: Modo escuro ativado');
	}
}
carregarPreferencias();
// Event listeners
btnIniciar.addEventListener('click', iniciar);
btnPausar.addEventListener('click', pausar);
btnZerar.addEventListener('click', zerar);
// Inicializa display
atualizarDisplay();

function validarEntrada(min, seg) {
  console.log('🔍 Validando entrada:', { minutos: min, segundos: seg });

  // 🚨 VALIDAÇÃO 1: Verificar se são números
  if (isNaN(min) || isNaN(seg)) {
    alert('❌ Por favor, insira apenas números válidos!');
    return false;
  }

  // 🚨 VALIDAÇÃO 2: Verificar se não são negativos
  if (min < 0 || seg < 0) {
    alert('⚠️ Valores negativos não são permitidos!\n\n• Minutos devem ser ≥ 0\n• Segundos devem ser ≥ 0');
    return false;
  }

  // 🚨 VALIDAÇÃO 3: Verificar segundos entre 0-59
  if (seg > 59) {
    mostrarErroInput(inputSegundos, 'Segundos acima de 59');
    alert('⚠️ Segundos inválidos!\n\n• Os segundos devem estar entre 0 e 59\n• Use os minutos para valores acima de 59 segundos');
    return false;
  }

  // 🚨 VALIDAÇÃO 4: Verificar se o tempo total é maior que zero
  if (min === 0 && seg === 0) {
    alert('⏰ O tempo precisa ser maior que zero!\n\n• Digite pelo menos 1 minuto ou 1 segundo');
    return false;
  }

  // 🚨 VALIDAÇÃO 5: Verificar tempo máximo (opcional - 24 horas)
  if (min > 1440) { // 24 horas em minutos
    alert('🕐 Tempo muito longo!\n\n• O tempo máximo é 24 horas (1440 minutos)\n• Digite um valor menor');
    return false;
  }

  console.log('✅ Entrada validada com sucesso!');
  return true;
}

// Função para mostrar erro visual
function mostrarErroInput(input, mensagem) {
  input.classList.add('invalido');
  console.log('❌ Erro no input:', mensagem);
  setTimeout(() => {
    input.classList.remove('invalido');
  }, 1000);
}

// Event listeners para validação em tempo real
inputMinutos.addEventListener('input', function() {
  let valor = parseInt(this.value) || 0;
  // Corrigir automaticamente valores negativos
  if (valor < 0) {
    this.value = 0;
    console.log('🛠️ Valor corrigido: negativo → 0');
  }
  // Limitar valor máximo
  if (valor > 1440) {
    this.value = 1440;
    console.log('🛠️ Valor limitado: 1440 minutos (24 horas)');
  }
});
inputSegundos.addEventListener('input', function() {
  let valor = parseInt(this.value) || 0;
  // Corrigir automaticamente valores negativos
  if (valor < 0) {
    this.value = 0;
    console.log('🛠️ Valor corrigido: negativo → 0');
  }
  // Corrigir automaticamente segundos acima de 59
  if (valor > 59) {
    this.value = 59;
    console.log('🛠️ Valor corrigido: >59 → 59');
  }
});