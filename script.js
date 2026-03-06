// ==============================
// CONFIGURAÇÃO DO QUESTIONÁRIO
// ==============================

const questions = [
  /* ROTINA */
  { text: "Mudança repentina de rotina sem explicação clara", weight: 2 },
  { text: "Aumento inesperado de compromissos fora de casa", weight: 3 },
  { text: "Alterações frequentes nos horários habituais", weight: 2 },
  { text: "Justificativas vagas para atrasos", weight: 3 },

  /* COMUNICAÇÃO */
  { text: "Redução significativa na comunicação diária", weight: 2 },
  { text: "Respostas defensivas a perguntas simples", weight: 3 },
  { text: "Evita conversas mais profundas", weight: 2 },
  { text: "Demonstra irritação sem motivo aparente", weight: 2 },

  /* COMPORTAMENTO DIGITAL */
  { text: "Uso excessivo e reservado do celular", weight: 3 },
  { text: "Proteção excessiva de senhas e dispositivos", weight: 3 },
  { text: "Apaga histórico ou notificações com frequência", weight: 3 },
  { text: "Muda o celular de posição ao se aproximar", weight: 2 },

  /* CONEXÃO EMOCIONAL */
  { text: "Diminuição do contato físico", weight: 2 },
  { text: "Menor demonstração de afeto", weight: 2 },
  { text: "Distanciamento emocional perceptível", weight: 3 },
  { text: "Comparações frequentes com outras pessoas", weight: 2 },

  /* FINANCEIRO */
  { text: "Despesas não explicadas", weight: 3 },
  { text: "Mudança no padrão de gastos", weight: 2 },
  { text: "Transações financeiras pouco claras", weight: 3 },
  { text: "Resistência em falar sobre dinheiro", weight: 2 }
];

let currentQuestion = 0;
let totalScore = 0;
let respostasUsuario = [];
let avaliacaoIdAtual = null;

// ==============================
// INICIAR TESTE
// ==============================

function startTest() {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  showQuestion();
}

// ==============================
// MOSTRAR PERGUNTA
// ==============================

function showQuestion() {
  const q = questions[currentQuestion];

  document.getElementById("questionContainer").innerHTML = `
    <div class="question">
      <p>${currentQuestion + 1}. ${q.text}</p>
      <select id="answer">
        <option value="0">Não observado</option>
        <option value="1">Leve</option>
        <option value="2">Moderado</option>
        <option value="3">Intenso</option>
      </select>
    </div>
  `;

  updateProgress();
}

// ==============================
// PROGRESSO
// ==============================

function updateProgress() {
  const progressPercent = (currentQuestion / questions.length) * 100;
  document.getElementById("progress").style.width = progressPercent + "%";
}

// ==============================
// PRÓXIMA PERGUNTA
// ==============================

function nextQuestion() {
  const answerElement = document.getElementById("answer");
  if (!answerElement) return;

  const value = parseInt(answerElement.value, 10);

  // guarda resposta real do usuário
  respostasUsuario.push({
    perguntaIndex: currentQuestion,
    pergunta: questions[currentQuestion].text,
    resposta: value,
    peso: questions[currentQuestion].weight
  });

  // soma score ponderado
  totalScore += value * questions[currentQuestion].weight;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

// ==============================
// FINALIZAR QUIZ
// ==============================

function finishQuiz() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("lead").classList.remove("hidden");
  document.getElementById("progress").style.width = "100%";
}

// ==============================
// GERAR RESULTADO + SALVAR
// ==============================

async function showResult() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (name.trim() === "" || email.trim() === "") {
    alert("Preencha nome e email para continuar.");
    return;
  }

  document.getElementById("lead").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  const maxScore = questions.reduce((sum, q) => sum + (3 * q.weight), 0);

  // ==============================
  // CÁLCULO INTELIGENTE PROPORCIONAL
  // ==============================

  let percentageBase = Math.round((totalScore / maxScore) * 100);
  let percentage = percentageBase;

  if (percentageBase < 85) {
    const proximidade = percentageBase / 85;
    const margemMaxima = 15 - (10 * proximidade);
    const aumento = Math.random() * margemMaxima;

    percentage = Math.round(percentageBase * (1 + aumento / 100));

    if (percentage > 100) percentage = 100;
  }

  document.getElementById("score").innerText =
    "Nível de Risco Percebido: " + percentage + "%";

  // ==============================
  // CLASSIFICAÇÃO
  // ==============================

  let classification = "";

  if (percentage <= 30) classification = "Risco Baixo";
  else if (percentage <= 60) classification = "Risco Moderado";
  else if (percentage <= 80) classification = "Risco Alto";
  else classification = "Risco Crítico";

  // ==============================
  // INTENSIDADE DETALHADA
  // ==============================

  let intensidade = "";

  if (percentage < 20) intensidade = "muito baixa";
  else if (percentage < 40) intensidade = "baixa";
  else if (percentage < 60) intensidade = "moderada";
  else if (percentage < 75) intensidade = "considerável";
  else if (percentage < 90) intensidade = "elevada";
  else intensidade = "muito elevada";

  // ==============================
  // PROBABILIDADE TEXTUAL
  // ==============================

  let probabilidadeTextual = "";

  if (percentage < 40) {
    probabilidadeTextual =
      "Existe uma baixa probabilidade de que essas mudanças indiquem algo mais profundo.";
  } else if (percentage < 75) {
    probabilidadeTextual =
      "Existe uma possibilidade real de que os comportamentos observados estejam indicando uma mudança relevante na dinâmica da relação.";
  } else {
    probabilidadeTextual =
      "Existe forte possibilidade de que os padrões identificados não sejam mera coincidência e mereçam atenção cuidadosa.";
  }

  // ==============================
  // FRASE FINAL DINÂMICA
  // ==============================

  const frasesImpacto = [
    "Nem toda mudança é inocente.",
    "A dúvida costuma surgir antes da confirmação.",
    "Quando padrões se repetem, raramente é por acaso.",
    "Algo pode estar acontecendo — mesmo que ainda não esteja claro.",
    "Ignorar sinais nem sempre faz eles desaparecerem."
  ];

  const fraseFinal =
    frasesImpacto[Math.floor(Math.random() * frasesImpacto.length)];

  const analysisText = `
    <strong>${name}</strong>, seu nível de risco percebido foi classificado como <strong>${classification}</strong>.<br><br>
    A intensidade dos sinais identificados é considerada <strong>${intensidade}</strong> (${percentage}%).<br><br>
    ${probabilidadeTextual}<br><br>
    Este resultado não confirma nada de forma definitiva, mas revela padrões que podem merecer observação mais atenta.<br><br>
    <strong>${fraseFinal}</strong><br><br>
    <button onclick="acaoEstrategica()" class="cta-button">
      Quero entender melhor esses sinais
    </button>
  `;

  document.getElementById("classification").innerHTML = analysisText;

  // ==============================
  // SALVAR AVALIAÇÃO COMPLETA NO FIRESTORE
  // ==============================

  try {
    avaliacaoIdAtual = await salvarAvaliacaoCompleta({
      nome: name,
      email: email,
      scoreBase: percentageBase,
      scoreFinal: percentage,
      classificacao: classification,
      intensidade: intensidade,
      respostas: respostasUsuario,
      totalPerguntas: questions.length,
      statusPagamento: "pending_payment",
      statusEntrega: "pending_delivery"
    });

    console.log("Avaliação salva com ID:", avaliacaoIdAtual);
  } catch (error) {
    console.error("Erro ao salvar avaliação completa:", error);
  }
}

// ==============================
// AÇÃO ESTRATÉGICA
// ==============================

function acaoEstrategica() {
  if (avaliacaoIdAtual) {
    alert("Sua avaliação foi registrada com sucesso. ID da avaliação: " + avaliacaoIdAtual);
  } else {
    alert("Sua avaliação foi gerada. Em breve você poderá continuar para o pagamento.");
  }
}

// ==============================
// SALVAR AVALIAÇÃO COMPLETA
// ==============================

async function salvarAvaliacaoCompleta(dados) {
  try {
    const { collection, addDoc, serverTimestamp } =
      await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    const docRef = await addDoc(collection(window.db, "avaliacoes"), {
      ...dados,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar no Firestore:", error);
    throw error;
  }
}




