const inputMsg = document.getElementById('inputText');
const btnSubmit = document.getElementById('submit');
const chatContainer = document.querySelector('.chat');

window.onload = () => {
    let historico = JSON.parse(localStorage.getItem('chat_nikolas')) || [];
    historico.forEach(msg => adicionarMensagem(msg.texto, msg.classe, false));

    const modoSalvo = localStorage.getItem('modo_escuro');
    if (modoSalvo === 'ativado') {
        document.body.classList.add('darkmode');
    }
};

async function chamarIA() {
    const textoUsuario = inputMsg.value.trim();
    if (textoUsuario === "") return;

    adicionarMensagem(textoUsuario, 'User');
    inputMsg.value = "";
    inputMsg.focus();

    const keyIA = "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";
    const url = "https://api.groq.com/openai/v1/chat/completions";

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${keyIA}`
            },
            body: JSON.stringify({
                "model": "llama-3.3-70b-versatile", 
                "messages": [{ "role": "user", "content": 'msg1: '+ textoUsuario+'.  msg2: Se alguém perguntar sobre sua identidade ou nome, responda que é NikolasIA. Se perguntarem quem criou você, diga que o chat ou site foi feito pelo nikolasdev. Responda apenas a msg1.'}]
            })
        });

        const dados = await resposta.json();
        if (dados.choices && dados.choices[0]) {
            adicionarMensagem(dados.choices[0].message.content, 'IA');
        }
    } catch (erro) {
        adicionarMensagem("Erro ao conectar.", 'IA');
    }
}

function adicionarMensagem(texto, classe, salvar = true) {
    const novoParagrafo = document.createElement('p');
    novoParagrafo.classList.add(classe);
    novoParagrafo.textContent = texto;
    chatContainer.appendChild(novoParagrafo);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (salvar) {
        let historico = JSON.parse(localStorage.getItem('chat_nikolas')) || [];
        historico.push({ texto, classe });
        localStorage.setItem('chat_nikolas', JSON.stringify(historico));
    }
}

btnSubmit.addEventListener('click', chamarIA);
inputMsg.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chamarIA();
    }
});

function transcricao() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!Recognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
    }

    const voz = new Recognition();
    voz.lang = "pt-BR";
    voz.interimResults = false;

    const btnVoz = document.querySelector('.fa-microphone')?.parentElement;
    if (btnVoz) btnVoz.style.background = "#ff4757";

    voz.start();

    voz.onresult = function (evento) {
        let textoTranscrito = evento.results[0][0].transcript;
        
        inputMsg.value = textoTranscrito;
        
        chamarIA();
    };

    voz.onend = function() {
        if (btnVoz) btnVoz.style.background = "rgba(255, 255, 255, 0.3)";
    };

    voz.onerror = function(event) {
        console.error("Erro na voz: ", event.error);
    };
}

const BtnMode = document.getElementById("BtnMode")
BtnMode.addEventListener("click", Mode)

function Mode() {
    document.body.classList.toggle('darkmode');

    if (document.body.classList.contains('darkmode')) {
        localStorage.setItem('modo_escuro', 'ativado');
    } else {
        localStorage.setItem('modo_escuro', 'desativado');
    }
}

const btnLimpar = document.getElementById('clear');

function limparHistorico() {
    localStorage.removeItem('chat_nikolas');
    chatContainer.innerHTML = "";
    console.log("Histórico de mensagens da NikolasIA foi resetado.");
}

btnLimpar.addEventListener('click', () => {
    if (confirm("Deseja apagar todo o histórico da conversa?")) {
        limparHistorico();
    }
});