// ==============================
// CONFIGURAÇÃO DO QUESTIONÁRIO
// ==============================

const questions = [

/* ROTINA */
{ text:"Mudança repentina de rotina sem explicação clara", weight:2 },
{ text:"Aumento inesperado de compromissos fora de casa", weight:3 },
{ text:"Alterações frequentes nos horários habituais", weight:2 },
{ text:"Justificativas vagas para atrasos", weight:3 },

/* COMUNICAÇÃO */
{ text:"Redução significativa na comunicação diária", weight:2 },
{ text:"Respostas defensivas a perguntas simples", weight:3 },
{ text:"Evita conversas mais profundas", weight:2 },
{ text:"Demonstra irritação sem motivo aparente", weight:2 },

/* COMPORTAMENTO DIGITAL */
{ text:"Uso excessivo e reservado do celular", weight:3 },
{ text:"Proteção excessiva de senhas e dispositivos", weight:3 },
{ text:"Apaga histórico ou notificações com frequência", weight:3 },
{ text:"Muda o celular de posição ao se aproximar", weight:2 },

/* CONEXÃO EMOCIONAL */
{ text:"Diminuição do contato físico", weight:2 },
{ text:"Menor demonstração de afeto", weight:2 },
{ text:"Distanciamento emocional perceptível", weight:3 },
{ text:"Comparações frequentes com outras pessoas", weight:2 },

/* FINANCEIRO */
{ text:"Despesas não explicadas", weight:3 },
{ text:"Mudança no padrão de gastos", weight:2 },
{ text:"Transações financeiras pouco claras", weight:3 },
{ text:"Resistência em falar sobre dinheiro", weight:2 }

];

let currentQuestion = 0;
let totalScore = 0;

// ==============================
// INICIAR TESTE
// ==============================

function startTest(){
    document.getElementById("start").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    showQuestion();
}

// ==============================
// MOSTRAR PERGUNTA
// ==============================

function showQuestion(){
    let q = questions[currentQuestion];

    document.getElementById("questionContainer").innerHTML = `
    <div class="question">
        <p>${currentQuestion+1}. ${q.text}</p>
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

function updateProgress(){
    let progressPercent = (currentQuestion / questions.length) * 100;
    document.getElementById("progress").style.width = progressPercent + "%";
}

// ==============================
// PRÓXIMA PERGUNTA
// ==============================

function nextQuestion(){

    let answerElement = document.getElementById("answer");
    if(!answerElement) return;

    let value = parseInt(answerElement.value);
    totalScore += value * questions[currentQuestion].weight;

    currentQuestion++;

    if(currentQuestion < questions.length){
        showQuestion();
    } else {
        finishQuiz();
    }
}

// ==============================
// FINALIZAR QUIZ
// ==============================

function finishQuiz(){
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("lead").classList.remove("hidden");
    document.getElementById("progress").style.width = "100%";
}

// ==============================
// GERAR RESULTADO + SALVAR
// ==============================

async function showResult(){

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if(name.trim() === "" || email.trim() === ""){
        alert("Preencha nome e email para continuar.");
        return;
    }

    document.getElementById("lead").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    let maxScore = questions.reduce((sum,q)=>sum + (3*q.weight),0);

    // ==============================
    // CÁLCULO INTELIGENTE PROPORCIONAL
    // ==============================

    let percentageBase = Math.round((totalScore / maxScore) * 100);
    let percentage = percentageBase;

    if (percentageBase < 85) {

        let proximidade = percentageBase / 85;
        let margemMaxima = 15 - (10 * proximidade);
        let aumento = Math.random() * margemMaxima;

        percentage = Math.round(percentageBase * (1 + aumento / 100));

        if (percentage > 100) {
            percentage = 100;
        }
    }

    document.getElementById("score").innerText =
        "Nível de Risco Percebido: " + percentage + "%";

    let classification = "";

    if(percentage <= 30){
        classification = "Risco Baixo";
    }
    else if(percentage <= 60){
        classification = "Risco Moderado";
    }
    else if(percentage <= 80){
        classification = "Risco Alto";
    }
    else{
        classification = "Risco Crítico";
    }

    document.getElementById("classification").innerText =
        "Classificação: " + classification;

    await salvarResultado({
        nome: name,
        email: email,
        pontuacao: percentage,
        classificacao: classification
    });

    console.log("Lead salvo com sucesso!");
}

// ==============================
// SALVAR NO FIREBASE
// ==============================

async function salvarResultado(dados){
    try {

        const { collection, addDoc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

        await addDoc(collection(window.db, "avaliacoes"), {
            ...dados,
            data: new Date()
        });

    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
}




