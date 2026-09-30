import { useState, useEffect } from "react";

// Importando as fotos para a transformação!
import fotoReal from "./assets/brunna_real.png";
import fotoPixel from "./assets/maze_game/rosto.png";

interface Props {
  setGame: (game: string) => void;
}

// 1. LISTA DE JOGOS (Fácil de editar e não repete código)
const GAMES = [
  {
    id: "jump",
    title: "Pula Corda",
    emoji: "🏃‍♀️",
    gradient: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/30",
  },
  {
    id: "copa",
    title: "O Trauma da Copa",
    emoji: "🏆",
    gradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/30",
  },
  {
    id: "bebe",
    title: "O Ciúme Fraterno",
    emoji: "🍼",
    gradient: "from-rose-400 to-red-500",
    shadow: "shadow-red-500/30",
  },
  {
    id: "peixe",
    title: "O Caso do Joca",
    emoji: "🐟",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-blue-500/30",
  },
  {
    id: "maze",
    title: "Fuga do Labirinto",
    emoji: "👻",
    gradient: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/30",
  },
  {
    id: "quiz",
    title: "Quiz da Brunna",
    emoji: "🧠",
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-orange-500/30",
  },
  {
    id: "whatsapp",
    title: "O Interrogatório",
    emoji: "📱",
    gradient: "from-teal-400 to-emerald-500",
    shadow: "shadow-teal-500/30",
  },
  {
    id: "dara",
    title: "A Dieta Impossível",
    emoji: "🐶",
    gradient: "from-yellow-400 to-amber-500",
    shadow: "shadow-yellow-500/30",
  },
];

export default function Hub({ setGame }: Props) {
  // Verifica se ela já viu a intro nesta sessão para não repetir toda vez que clicar em "Voltar"
  const hasSeenIntro = sessionStorage.getItem("introSeen") === "true";

  // step 0: Feliz Aniversário | step 1: O Plano | step 2: A Transformação | step 3: HUB
  const [step, setStep] = useState(hasSeenIntro ? 3 : 0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Efeito da Transformação (Step 2)
  useEffect(() => {
    if (step === 2) {
      // Começa a virar a carta após meio segundo
      const flipTimer = setTimeout(() => setIsFlipping(true), 500);

      // Vai para o Hub 3 segundos após virar o personagem
      const hubTimer = setTimeout(() => {
        sessionStorage.setItem("introSeen", "true");
        setStep(3);
      }, 4000);

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(hubTimer);
      };
    }
  }, [step]);

  // Se já estiver no Step 3, renderiza o HUB MODERNO
  if (step === 3) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-6 font-sans">
        {/* Cabeçalho do Hub */}
        <div className="w-full max-w-md mt-6 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-block p-2 bg-white rounded-full shadow-sm mb-3">
            <img
              src={fotoPixel}
              alt="Brunna"
              className="w-16 h-16 object-contain bg-pink-50 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Aniversário da Fururu
          </h1>
          <p className="text-gray-600 font-medium mt-2 text-sm">
            Escolha uma memória para reviver:
          </p>
        </div>

        {/* Lista de Jogos (Gerada Dinamicamente) */}
        <div className="w-full max-w-md flex flex-col gap-4 pb-12">
          {GAMES.map((game, index) => (
            <button
              key={game.id}
              onClick={() => setGame(game.id)}
              style={{ animationDelay: `${index * 100}ms` }}
              className={`w-full group relative overflow-hidden bg-gradient-to-r ${game.gradient} p-1 rounded-2xl shadow-lg ${game.shadow} transform transition-all duration-300 hover:scale-[1.03] active:scale-95 animate-in fade-in slide-in-from-bottom-4 fill-mode-both`}
            >
              <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl h-full w-full border border-white/30">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {game.emoji}
                </div>
                <span className="text-white font-bold text-lg md:text-xl text-left drop-shadow-md">
                  {game.title}
                </span>
                <div className="ml-auto text-white/50 group-hover:text-white transition-colors">
                  ▶
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // TELA DE INTRODUÇÃO (Steps 0, 1 e 2)
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-900 p-6 font-sans text-center overflow-hidden">
      {/* Background animado de partículas brilhantes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900 via-purple-900 to-gray-900 opacity-60"></div>

      <div className="relative z-10 w-full max-w-sm">
        {/* STEP 0: A Homenagem Inicial */}
        {step === 0 && (
          <div className="animate-in fade-in zoom-in duration-700">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 drop-shadow-lg">
              Feliz Aniversário, Brunna! 🎉
            </h1>

            <div className="w-48 h-48 mx-auto mb-8 rounded-full p-2 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-[0_0_40px_rgba(236,72,153,0.4)]">
              <img
                src={fotoReal}
                alt="Brunna Real"
                className="w-full h-full object-cover rounded-full border-4 border-gray-900"
              />
            </div>

            <p className="text-gray-300 text-lg mb-10 leading-relaxed font-medium">
              Hoje é um dia especial. Mas ao invés de apenas dar os parabéns...
            </p>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-white text-gray-900 py-4 rounded-full font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-transform"
            >
              Continuar ➔
            </button>
          </div>
        )}

        {/* STEP 1: A Proposta */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="text-6xl mb-6 animate-bounce">🕰️</div>
            <h2 className="text-3xl font-black text-white mb-6 leading-tight">
              Decidimos relembrar seus momentos mais...{" "}
              <span className="text-pink-400">Icônicos!</span>
            </h2>

            <p className="text-gray-300 text-lg mb-10 leading-relaxed bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md">
              Os choros por camisas erradas, os tombos memoráveis e os peixes
              achocolatados. Tudo virou um jogo!
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-full font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              Iniciar Conversão Digital ⚡
            </button>
          </div>
        )}

        {/* STEP 2: A Animação de Transformação 3D */}
        {step === 2 && (
          <div className="animate-in fade-in duration-1000 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-black text-white mb-10 tracking-widest uppercase animate-pulse">
              Digitalizando...
            </h2>

            {/* CONTAINER 3D DO FLIP */}
            <div className="w-56 h-56 perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isFlipping ? "[transform:rotateY(180deg)]" : ""}`}
              >
                {/* FRENTE: Foto Real */}
                <div className="absolute w-full h-full [backface-visibility:hidden] rounded-full p-2 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-2xl">
                  <img
                    src={fotoReal}
                    alt="Brunna Real"
                    className="w-full h-full object-cover rounded-full border-4 border-gray-900"
                  />
                </div>

                {/* VERSO: Foto do Personagem */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-full p-2 bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_50px_rgba(6,182,212,0.6)]">
                  <img
                    src={fotoPixel}
                    alt="Brunna Personagem"
                    className="w-full h-full object-contain bg-white rounded-full border-4 border-gray-900"
                  />
                </div>
              </div>
            </div>

            <p className="mt-12 text-pink-400 font-bold text-lg animate-bounce">
              {isFlipping ? "Personagem Pronta!" : "Processando memórias..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
