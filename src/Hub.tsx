import { useState, useEffect, useRef } from "react";

// Importando as fotos para a transformação
import fotoReal from "./assets/brunna_real.png";
import fotoPixel from "./assets/maze_game/rosto.png";

// Música de parabéns de fundo
import parabensMusic from "./assets/jump_game/parabens.mp3";

interface Props {
  setGame: (game: string) => void;
}

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
    emoji: "🛍️",
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
  const hasSeenIntro = sessionStorage.getItem("introSeen") === "true";

  const [step, setStep] = useState(hasSeenIntro ? 3 : 0);
  const [isFlipping, setIsFlipping] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (step === 2) {
      const flipTimer = setTimeout(() => setIsFlipping(true), 500);

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

  // HUB PRINCIPAL
  if (step === 3) {
    return (
      <div
        className="min-h-[100dvh] flex flex-col items-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-6 font-sans select-none"
        onClick={playMusic}
      >
        <audio ref={audioRef} src={parabensMusic} loop autoPlay />

        {/* Cabeçalho */}
        <div className="w-full max-w-md mt-6 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-block p-2 bg-white rounded-full shadow-sm mb-3 border border-pink-100">
            <img
              src={fotoPixel}
              alt="Brunna"
              className="w-16 h-16 object-contain bg-pink-50 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Multiverso da Brunna
          </h1>
          <p className="text-gray-600 font-medium mt-2 text-sm">
            Escolha uma memória para reviver:
          </p>
        </div>

        {/* Lista de Jogos */}
        <div className="w-full max-w-md flex flex-col gap-4 pb-12">
          {GAMES.map((game, index) => (
            <button
              key={game.id}
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setGame(game.id);
              }}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`w-full group relative overflow-hidden bg-gradient-to-r ${game.gradient} p-1 rounded-2xl shadow-lg ${game.shadow} transform transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-in fade-in slide-in-from-bottom-4 fill-mode-both`}
            >
              <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl h-full w-full border border-white/30">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {game.emoji}
                </div>
                <span className="text-white font-bold text-lg md:text-xl text-left drop-shadow-md">
                  {game.title}
                </span>
                <div className="ml-auto text-white/60 group-hover:text-white transition-colors">
                  ▶
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // TELAS DA INTRODUÇÃO
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-950 p-6 font-sans text-center overflow-hidden select-none">
      <audio ref={audioRef} src={parabensMusic} loop />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-950/40 via-purple-950/20 to-gray-950 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm">
        {/* STEP 0: Mensagem de Irmão */}
        {step === 0 && (
          <div className="animate-in fade-in zoom-in duration-700">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 drop-shadow-lg">
              Feliz Aniversário, Maninha! 🎉
            </h1>

            <div className="w-44 h-44 mx-auto mb-6 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
              <img
                src={fotoReal}
                alt="Brunna Real"
                className="w-full h-full object-cover rounded-full border-4 border-gray-900"
              />
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/10 text-left">
              <p className="text-gray-200 text-sm leading-relaxed mb-3">
                Parabéns pelo seu dia! Ter você como irmã é saber que nunca vai
                faltar risada, drama e história inacreditável pra contar.
              </p>
              <p className="text-gray-300 text-xs leading-relaxed italic">
                Te amo muito! Mas como irmão de verdade não vive só de elogio...
                resolvi imortalizar seus maiores micos da vida. 😂❤️
              </p>
            </div>

            <button
              onClick={() => {
                playMusic();
                setStep(1);
              }}
              className="w-full bg-white text-gray-950 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
            >
              Continuar ➔
            </button>
          </div>
        )}

        {/* STEP 1: A Ideia dos Jogos */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="text-5xl mb-6">🎮</div>
            <h2 className="text-2xl font-black text-white mb-4 leading-tight">
              O Multiverso das Suas{" "}
              <span className="text-pink-400">Vergonhas</span>
            </h2>

            <p className="text-gray-300 text-sm mb-8 leading-relaxed bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
              Vamos ver o que tem de micooooo
            </p>

            <button
              onClick={() => {
                playMusic();
                setStep(2);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
            >
              Digitalizar a Brunna ⚡
            </button>
          </div>
        )}

        {/* STEP 2: Animação de Conversão */}
        {step === 2 && (
          <div className="animate-in fade-in duration-700 flex flex-col items-center justify-center">
            <h2 className="text-xl font-black text-white mb-8 tracking-widest uppercase animate-pulse">
              Carregando Micos...
            </h2>

            <div className="w-52 h-52 perspective-1000">
              <div
                className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${
                  isFlipping ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Frente: Foto Real */}
                <div className="absolute w-full h-full [backface-visibility:hidden] rounded-full p-2 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-2xl">
                  <img
                    src={fotoReal}
                    alt="Brunna Real"
                    className="w-full h-full object-cover rounded-full border-4 border-gray-900"
                  />
                </div>

                {/* Verso: Foto Pixel */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-full p-2 bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_50px_rgba(6,182,212,0.6)]">
                  <img
                    src={fotoPixel}
                    alt="Brunna Pixel"
                    className="w-full h-full object-contain bg-white rounded-full border-4 border-gray-900"
                  />
                </div>
              </div>
            </div>

            <p className="mt-8 text-pink-400 font-bold text-sm tracking-wider uppercase">
              {isFlipping
                ? "Brunna Gamer Pronta!"
                : "Sincronizando memórias..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
