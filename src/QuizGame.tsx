import { useState, useRef, useEffect } from "react";

// Imagem da Brunna (estilo 8-bit / pixel art) e áudios
import rostoImg from "./assets/maze_game/rosto.png";
import victoriaSound from "./assets/jump_game/parabens.mp3";
import tristezaSound from "./assets/jump_game/tristeza.mp3";
import burraImg from "./assets/maze_game/burra.png";

interface Props {
  setGame: (game: string) => void;
}

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  comment: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    subject: "PORTUGUÊS",
    question:
      "Qual frase faz o professor de português querer chorar de desgosto?",
    options: [
      "Vou estar transferindo a ligação.",
      "Para mim ir ao shopping comprar brusinha.",
      "Há dois anos atrás eu já sabia disso.",
      "Todas as alternativas juntas!",
    ],
    correctIndex: 3,
    comment: "Gabaritava essa na época da escola sem nem piscar...",
  },
  {
    id: 2,
    subject: "MATEMÁTICA",
    question:
      "Se uma calça custa R$ 200 e tá com 50% de desconto, quanto sobrou do seu limite?",
    options: [
      "Zero, porque levei duas.",
      "R$ 100 pra torrar na praça de alimentação.",
      "Matemática financeira não se aplica a compras de impulso.",
      "X = Regra de 3 que nunca aprendi.",
    ],
    correctIndex: 0,
    comment: "E no fim a conta nunca fecha no final do mês!",
  },
  {
    id: 3,
    subject: "HISTÓRIA",
    question:
      "O que marcou o fim da Idade Média e o começo dos seus traumas escolares?",
    options: [
      "A queda do Império Bizantino.",
      "O dia em que a primeira nota 2,0 chegou pra assinar.",
      "A invenção da prensa de Gutenberg.",
      "A criação da temida prova de recuperação de dezembro.",
    ],
    correctIndex: 3,
    comment:
      "Dezembro chegando e a ansiedade batendo desde os 10 anos de idade!",
  },
  {
    id: 4,
    subject: "QUÍMICA",
    question:
      "Qual a reação química quando a professora entregava a prova de recuperação?",
    options: [
      "Sudorese + Taquicardia + Pânico Instântaneo",
      "H₂O + Choro livre no banheiro",
      "Combustão de neurônios ao tentar adivinhar a A",
      "Todas as anteriores simultaneamente",
    ],
    correctIndex: 3,
    comment: "Experimento científico ao vivo na sala de aula!",
  },
  {
    id: 5,
    subject: "FÍSICA",
    question:
      "Segundo a lei da gravidade, o que cai mais rápido no final do bimestre?",
    options: [
      "Uma maçã de uma árvore.",
      "A sua média geral da sala.",
      "As esperanças de passar direto sem exame.",
      "A cara de pau de falar que estudou.",
    ],
    correctIndex: 2,
    comment: "Nem Isaac Newton explicava como você ia parar no exame todo ano!",
  },
];

export default function QuizGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const tristezaRef = useRef<HTMLAudioElement>(null);
  const parabensRef = useRef<HTMLAudioElement>(null);

  const currentQ = QUESTIONS[currentQIndex];

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    setShowComment(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowComment(false);

    if (currentQIndex + 1 < QUESTIONS.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      if (tristezaRef.current) {
        tristezaRef.current.currentTime = 0;
        tristezaRef.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    if (isFinished) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        // @ts-expect-error
        window.confetti({
          particleCount: 180,
          spread: 120,
          origin: { y: 0.4 },
          zIndex: 9999,
        });
      };
      document.body.appendChild(script);
    }
  }, [isFinished]);

  const restartQuiz = () => {
    setHasStarted(true);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowComment(false);
    setIsFinished(false);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 select-none font-mono flex flex-col items-center justify-between p-3 text-white">
      <audio ref={tristezaRef} src={tristezaSound} />
      <audio ref={parabensRef} src={victoriaSound} />

      {/* Topo / Status Bar Retro */}
      <div className="w-full max-w-md flex items-center justify-between z-30 pt-1 border-b-2 border-yellow-400/30 pb-2">
        <button
          onClick={() => setGame("hub")}
          className="px-3 py-1 bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          ◄ SAIR
        </button>

        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 border-2 border-slate-700">
          <img
            src={rostoImg}
            alt="Brunna 8-Bit"
            className="w-6 h-6 object-contain image-rendering-pixelated rounded bg-fuchsia-900/60 p-0.5 border border-fuchsia-400"
          />
          <span className="text-[11px] font-bold text-yellow-400 tracking-wider">
            STAGE {currentQIndex + 1}/{QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Conteúdo Principal do Quiz 8-bit */}
      {hasStarted && !isFinished && (
        <div className="w-full max-w-md my-auto flex flex-col gap-3">
          {/* Caixa de Pergunta estilo RPG / Retro */}
          <div className="bg-slate-800 rounded-none p-4 border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(234,179,8,0.4)] relative">
            <div className="inline-block bg-yellow-400 text-slate-950 font-black px-2 py-0.5 text-[10px] tracking-widest uppercase mb-2">
              MATÉRIA: {currentQ.subject}
            </div>

            <p className="text-gray-100 font-bold text-sm md:text-base leading-relaxed tracking-tight">
              {currentQ.question}
            </p>
          </div>

          {/* Alternativas */}
          <div className="flex flex-col gap-2">
            {currentQ.options.map((option, idx) => {
              let btnStyle =
                "bg-slate-800 text-gray-200 border-2 border-slate-600 hover:border-yellow-400 active:bg-slate-700";

              if (selectedOption !== null) {
                if (idx === currentQ.correctIndex) {
                  btnStyle =
                    "bg-emerald-600 text-white font-bold border-2 border-emerald-300 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
                } else if (idx === selectedOption) {
                  btnStyle =
                    "bg-rose-600 text-white font-bold border-2 border-rose-300 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
                } else {
                  btnStyle =
                    "bg-slate-900 text-slate-600 border-slate-800 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-3 text-left font-bold text-xs uppercase tracking-wider transition-all flex items-start gap-2.5 ${btnStyle}`}
                >
                  <span className="bg-yellow-400 text-slate-950 px-1.5 py-0.5 font-black text-[10px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-tight pt-0.5">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Diálogo Retro do NPC */}
          {showComment && (
            <div className="bg-fuchsia-950/90 border-2 border-fuchsia-500 p-3 rounded-none animate-in fade-in slide-in-from-bottom-2">
              <p className="text-fuchsia-200 text-xs italic leading-relaxed">
                <span className="text-yellow-300 font-bold tracking-wider">
                  💬 MEMÓRIA DA ESCOLA:
                </span>{" "}
                "{currentQ.comment}"
              </p>
              <button
                onClick={handleNext}
                className="w-full mt-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 py-2 font-black text-xs uppercase tracking-widest border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                {currentQIndex + 1 < QUESTIONS.length
                  ? "PRÓXIMO DESAFIO ►"
                  : "VER RESULTADO FINAL 📜"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE INTRODUÇÃO (MODO RETRO 8-BIT) */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in zoom-in">
          <div className="bg-slate-900 rounded-none p-5 max-w-md w-full shadow-2xl text-center border-4 border-yellow-400 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 bg-slate-800 rounded-none border-2 border-yellow-400 flex items-center justify-center mx-auto mb-3">
              <img
                src={rostoImg}
                alt="Brunna Pixel"
                className="w-12 h-12 object-contain image-rendering-pixelated"
              />
            </div>

            <h2 className="text-xl font-black text-yellow-400 mb-2 uppercase tracking-widest">
              PROVA FINAL DE DEZEMBRO 🎒
            </h2>

            <p className="text-gray-300 font-sans text-xs md:text-sm my-3 leading-relaxed bg-slate-800 p-4 border-2 border-slate-700">
              Lembra daquela época em que você vivia na corda bamba colecionando
              recuperação e rezando por nota do conselho? 💀
              <br />
              <br />
              Bora ver se hoje em dia você sabe o básico de{" "}
              <span className="text-yellow-400 font-bold">
                Português, Matemática, História, Química e Física
              </span>{" "}
              ou se vai direto pro exame final de novo!
            </p>

            <div className="bg-yellow-400/10 p-2.5 border border-yellow-400/40 mb-4 text-[11px] text-yellow-300 font-mono uppercase tracking-wider">
              ⚠️ ATENÇÃO: ERROS RESULTARÃO EM RECUPERAÇÃO AUTOMÁTICA!
            </div>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 py-3 font-black text-sm uppercase tracking-widest border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              INICIAR PROVA ✍️
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE BOLETIM FINAL (RECUPERAÇÃO EM DESTAQUE) */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in zoom-in">
          <div className="bg-slate-900 rounded-none p-5 max-w-md w-full shadow-2xl text-center border-4 border-rose-600 max-h-[95vh] overflow-y-auto">
            {/* Stamp Pixelado de Recuperação Gigante em Destaque */}
            <div className="relative border-4 border-rose-600 p-4 bg-slate-950 mb-4 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              {/* Carimbo Pulsante em Destaque Absoluto */}
              <div className="absolute -top-5 -right-2 rotate-6 bg-rose-600 text-white font-black px-4 py-1.5 text-sm uppercase tracking-widest border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-pulse z-20">
                🚨 RECUPERAÇÃO! ❌
              </div>

              {/* Imagem burra.png em Destaque no Topo */}
              <div className="flex justify-center mb-3 pt-2">
                <img
                  src={burraImg}
                  alt="Brunna Burra"
                  className="w-20 h-20 object-contain image-rendering-pixelated bg-slate-900 p-1 border-2 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                />
              </div>

              <h2 className="text-xl font-black text-yellow-400 uppercase tracking-widest border-b-2 border-slate-800 pb-2">
                BOLETIM FINAL 📄
              </h2>

              {/* Status piscando em vermelho */}
              <p className="text-xs text-rose-400 font-mono my-2.5 uppercase font-bold tracking-wider animate-pulse">
                ALUNA: BRUNNA // STATUS: ❌ REPROVADA (EM RECUPERAÇÃO)
              </p>

              {/* Tabela de Notas */}
              <div className="mt-3 text-[11px] font-mono">
                <div className="grid grid-cols-3 bg-slate-800 p-1.5 text-yellow-400 font-bold border-b border-slate-700 uppercase">
                  <span>DISCIPLINA</span>
                  <span>NOTA</span>
                  <span>SITUAÇÃO</span>
                </div>

                {QUESTIONS.map((q, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 p-1.5 border-b border-slate-800/80 items-center text-[10px]"
                  >
                    <span className="text-left font-bold text-gray-300">
                      {q.subject}
                    </span>
                    <span className="text-rose-400 font-black text-xs">
                      2.5
                    </span>
                    <span className="text-rose-400 font-black bg-rose-950/80 px-1 py-0.5 border border-rose-600 uppercase text-[9px] tracking-wider">
                      RECUPERAÇÃO
                    </span>
                  </div>
                ))}
              </div>

              {/* Caixa de Aviso do Conselho */}
              <div className="mt-3 bg-rose-950/40 p-3 border-2 border-rose-600 text-xs text-rose-200 font-sans leading-relaxed">
                <p className="font-bold text-yellow-400 text-sm mb-1">
                  Pontuação: {score} / {QUESTIONS.length} acertos
                </p>
                <span className="text-[11px] text-rose-300 italic font-semibold">
                  Parecer do Conselho: Não adiantou nada crescer, vai passar o
                  fim de semana estudando para a RECUPERAÇÃO de novo! 😂
                </span>
              </div>
            </div>

            <p className="text-gray-300 font-sans text-xs mb-4 bg-slate-800 p-3 border border-slate-700 leading-snug">
              Brincadeiras à parte, parabéns pelo seu dia! Mas admito que
              relembrar suas recuperações foi a melhor parte! 😂❤️
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={restartQuiz}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 font-black text-xs uppercase tracking-widest border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                FAZER A RECUPERAÇÃO DE NOVO 🔄
              </button>
              <button
                onClick={() => setGame("hub")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 py-2 font-bold text-xs uppercase tracking-wider border border-slate-600 transition-all"
              >
                VOLTAR AO HUB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
