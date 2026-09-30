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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-zinc-950 select-none font-mono flex flex-col items-center justify-between p-4 text-white">
      <audio ref={tristezaRef} src={tristezaSound} />
      <audio ref={parabensRef} src={victoriaSound} />

      {/* Topo / Status Bar Retro Minimalista */}
      <div className="w-full max-w-md flex items-center justify-between z-30 pt-2 pb-4">
        <button
          onClick={() => setGame("hub")}
          className="text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
        >
          ◄ Sair
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
            Questão {currentQIndex + 1}/{QUESTIONS.length}
          </span>
          <img
            src={rostoImg}
            alt="Brunna"
            className="w-6 h-6 object-contain grayscale opacity-50"
          />
        </div>
      </div>

      {/* Conteúdo Principal do Quiz */}
      {hasStarted && !isFinished && (
        <div className="w-full max-w-md my-auto flex flex-col gap-6">
          {/* Caixa de Pergunta Minimalista */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 relative shadow-2xl">
            <span className="absolute -top-3 left-6 bg-zinc-800 text-zinc-300 font-bold px-3 py-1 text-[10px] tracking-widest uppercase rounded-sm border border-zinc-700">
              {currentQ.subject}
            </span>
            <p className="text-gray-100 font-bold text-base md:text-lg leading-relaxed mt-2">
              {currentQ.question}
            </p>
          </div>

          {/* Alternativas Limpas */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((option, idx) => {
              let btnStyle =
                "bg-zinc-900 text-gray-300 border border-zinc-800 hover:border-zinc-500 active:bg-zinc-800";

              if (selectedOption !== null) {
                if (idx === currentQ.correctIndex) {
                  btnStyle =
                    "bg-emerald-900/30 text-emerald-400 font-bold border border-emerald-500/50";
                } else if (idx === selectedOption) {
                  btnStyle =
                    "bg-red-900/30 text-red-400 font-bold border border-red-500/50";
                } else {
                  btnStyle =
                    "bg-zinc-950 text-zinc-700 border-zinc-900 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-lg text-left font-medium text-sm uppercase tracking-wide transition-all flex items-start gap-4 ${btnStyle}`}
                >
                  <span className="opacity-50 font-black text-xs shrink-0 pt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Diálogo do Comentário */}
          {showComment && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-zinc-400 text-sm italic leading-relaxed text-center px-4 mb-6">
                "{currentQ.comment}"
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-white text-black py-4 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                {currentQIndex + 1 < QUESTIONS.length
                  ? "Próxima Questão"
                  : "Ver Boletim Final"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE INTRODUÇÃO (MINIMALISTA) */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in zoom-in">
          <div className="bg-zinc-950 rounded-xl p-8 max-w-md w-full shadow-2xl text-center border border-zinc-800">
            <div className="flex justify-center mb-6">
              <img
                src={rostoImg}
                alt="Brunna"
                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
            </div>

            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-widest">
              Prova Final
            </h2>

            <p className="text-zinc-400 font-sans text-sm my-6 leading-relaxed">
              Lembra daquela época em que você vivia na corda bamba colecionando
              recuperação e rezando por nota do conselho?
              <br />
              <br />
              Vamos ver se hoje em dia você sabe o básico para não ir direto
              para o exame final de novo.
            </p>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full bg-white text-black py-4 mt-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Iniciar Prova
            </button>
          </div>
        </div>
      )}

      {/* BOLETIM FINAL (MINIMALISTA E FOCADO NA RECUPERAÇÃO) */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in zoom-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl text-center relative max-h-[95vh] overflow-y-auto">
            {/* Stamp Redesenhado - Agressivo, Sem Bordas Extras */}
            <div className="absolute top-6 -right-2 md:-right-6 rotate-[15deg] bg-red-600 text-white font-black px-6 py-2 text-xl md:text-2xl uppercase tracking-widest shadow-2xl z-30">
              RECUPERAÇÃO
            </div>

            {/* Imagem Gigante Limpa */}
            <div className="flex justify-center mb-6 pt-4 relative z-20">
              <img
                src={burraImg}
                alt="Brunna Burra"
                className="w-48 h-48 object-contain drop-shadow-[0_20px_30px_rgba(220,38,38,0.25)]"
              />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1">
              Boletim Final
            </h2>
            <p className="text-zinc-600 font-mono text-xs uppercase font-bold tracking-widest mb-8">
              Aluna: Brunna
            </p>

            {/* Tabela Minimalista */}
            <div className="w-full font-mono text-sm px-2">
              <div className="flex justify-between text-zinc-500 border-b border-zinc-800 pb-2 mb-2 uppercase text-[10px] font-black tracking-wider">
                <span>Disciplina</span>
                <span className="text-right">Situação</span>
              </div>

              {QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-zinc-900 last:border-0"
                >
                  <span className="text-zinc-300 font-medium text-xs">
                    {q.subject}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 font-black">2.5</span>
                    <span className="bg-red-950/40 text-red-500 px-2 py-1 text-[9px] font-black tracking-widest uppercase rounded">
                      RECUPERAÇÃO
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-8 border-l-2 border-red-600 pl-4 text-left">
              <p className="text-red-500 font-black text-sm mb-1 uppercase tracking-widest">
                Parecer do Conselho
              </p>
              <p className="text-zinc-400 italic text-sm leading-relaxed">
                "Não adiantou nada crescer. Vai passar o fim de semana estudando
                para a recuperação de novo. Parabéns pelo seu dia!"
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={restartQuiz}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest transition-colors"
              >
                Fazer a Recuperação de Novo
              </button>
              <button
                onClick={() => setGame("hub")}
                className="w-full bg-transparent hover:bg-zinc-900 text-zinc-500 py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Voltar ao Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
