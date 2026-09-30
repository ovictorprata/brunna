import { useState, useEffect, useRef } from "react";

// Importando as imagens
import peixeVivo from "./assets/jump_game/peixe_vivo.png";
import peixeMorto from "./assets/jump_game/peixe_morto.png";
import toddyImg from "./assets/jump_game/toddy.png";
import racaoImg from "./assets/jump_game/racao.png";

import tristezaSound from "./assets/jump_game/tristeza.mp3";

interface Props {
  setGame: (game: string) => void;
}

export default function FishGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [isDead, setIsDead] = useState(false);
  const [fishPos, setFishPos] = useState({ x: 50, y: 50, flip: false });

  const [feedEffects, setFeedEffects] = useState<
    { id: number; type: "racao" | "toddy"; x: number }[]
  >([]);
  const [swapButtons, setSwapButtons] = useState(false);

  const tristezaRef = useRef<HTMLAudioElement>(null);

  // Movimento do Joca
  useEffect(() => {
    if (!hasStarted || isDead) return;

    const swimInterval = setInterval(() => {
      setFishPos((prev) => {
        const newX = Math.max(
          15,
          Math.min(85, prev.x + (Math.random() * 40 - 20)),
        );
        const newY = Math.max(
          20,
          Math.min(80, prev.y + (Math.random() * 30 - 15)),
        );
        return {
          x: newX,
          y: newY,
          flip: newX > prev.x,
        };
      });
    }, 2000);

    return () => clearInterval(swimInterval);
  }, [hasStarted, isDead]);

  // Dar Ração
  const feedRacao = () => {
    if (isDead || !hasStarted) return;

    const newId = Date.now() + Math.random();
    setFeedEffects((prev) => [
      ...prev,
      { id: newId, type: "racao", x: fishPos.x },
    ]);

    setScore((s) => {
      const newScore = s + 1;
      if (Math.random() > 0.6) {
        setSwapButtons((prev) => !prev);
      }
      return newScore;
    });

    setTimeout(() => {
      setFeedEffects((prev) => prev.filter((e) => e.id !== newId));
    }, 1000);
  };

  // Dar Toddy
  const feedToddy = () => {
    if (isDead || !hasStarted) return;

    const newId = Date.now() + Math.random();
    setFeedEffects((prev) => [
      ...prev,
      { id: newId, type: "toddy", x: fishPos.x },
    ]);

    setIsDead(true);

    if (tristezaRef.current) {
      tristezaRef.current.currentTime = 0;
      tristezaRef.current.play().catch(() => {});
    }

    setFishPos((prev) => ({ ...prev, y: 10 }));

    setTimeout(() => {
      setGameOver(true);
    }, 1500);
  };

  const startGame = () => setHasStarted(true);

  const restartGame = () => {
    setScore(0);
    setIsDead(false);
    setGameOver(false);
    setSwapButtons(false);
    setFeedEffects([]);
    setFishPos({ x: 50, y: 50, flip: false });
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden select-none touch-none bg-blue-950 font-sans flex flex-col">
      <audio ref={tristezaRef} src={tristezaSound} />

      <style>{`
        @keyframes foodFall {
          0% { top: -10%; opacity: 1; transform: translateY(0) rotate(0deg); }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; transform: translateY(0) rotate(180deg); }
        }
        .animate-food-fall {
          animation: foodFall 1s ease-in forwards;
        }
      `}</style>

      {/* Cenário: Aquário */}
      <div className="relative w-full h-[75vh] bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-800 shadow-inner overflow-hidden border-b-8 border-blue-900">
        <div className="absolute bottom-0 left-[20%] w-4 h-4 bg-white/30 rounded-full animate-[ping_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 left-[70%] w-6 h-6 bg-white/20 rounded-full animate-[ping_6s_ease-in-out_infinite]"></div>

        <div className="absolute bottom-0 left-10 w-4 h-32 bg-green-500 rounded-t-full blur-[2px] opacity-80 -skew-x-12"></div>
        <div className="absolute bottom-0 left-16 w-3 h-24 bg-green-400 rounded-t-full blur-[1px] opacity-90 skew-x-6"></div>
        <div className="absolute bottom-0 right-10 w-6 h-40 bg-emerald-600 rounded-t-full blur-[2px] opacity-80 skew-x-12"></div>

        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40">
          <button
            onClick={() => setGame("hub")}
            className="px-6 py-2 bg-white/90 text-blue-700 font-extrabold rounded-full shadow-lg active:scale-95 transition-all"
          >
            ← Voltar
          </button>

          {hasStarted && (
            <div className="bg-white/90 px-6 py-2 rounded-full shadow-lg text-center flex flex-col items-center">
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                Dias Vivo
              </span>
              <span className="text-3xl font-black text-blue-700 leading-none">
                {score}
              </span>
            </div>
          )}
        </div>

        {/* Efeito Visual: Comida e Toddy caindo */}
        {feedEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute z-30 animate-food-fall"
            style={{ left: `${effect.x}%` }}
          >
            {effect.type === "racao" ? (
              <div className="relative w-10 h-10 -translate-x-1/2">
                <div className="absolute top-0 left-2 w-3 h-3 bg-[#8B4513] rounded-sm"></div>
                <div className="absolute top-4 left-6 w-2 h-2 bg-[#D2691E] rounded-sm"></div>
                <div className="absolute top-7 left-1 w-3 h-3 bg-[#A0522D] rounded-sm"></div>
                <div className="absolute top-2 left-8 w-2 h-2 bg-[#CD853F] rounded-sm"></div>
              </div>
            ) : (
              <img
                src={toddyImg}
                alt="Toddy caindo"
                className="w-12 h-12 object-contain -translate-x-1/2 drop-shadow-md"
              />
            )}
          </div>
        ))}

        {/* O PEIXE JOCA */}
        <div
          className="absolute w-24 h-24 md:w-32 md:h-32 bg-contain bg-no-repeat bg-center z-20"
          style={{
            backgroundImage: `url(${isDead ? peixeMorto : peixeVivo})`,
            left: `${fishPos.x}%`,
            top: `${fishPos.y}%`,
            transform: `translate(-50%, -50%) ${isDead ? "rotate(180deg)" : fishPos.flip ? "rotateY(180deg)" : "rotateY(0deg)"}`,
            transition: isDead
              ? "top 1.5s ease-out, transform 0.5s"
              : "top 2s ease-in-out, left 2s ease-in-out, transform 0.3s",
            filter: "drop-shadow(0px 10px 8px rgba(0,0,0,0.4))",
          }}
        >
          {feedEffects
            .filter((e) => e.type === "racao" && !isDead)
            .map((e) => (
              <div
                key={e.id}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-black text-xl animate-[ping_0.8s_ease-out_forwards]"
              >
                +1
              </div>
            ))}
        </div>
      </div>

      {/* CONTROLES: BASE DA TELA */}
      <div className="w-full h-[25vh] flex flex-col justify-center relative pb-safe">
        {hasStarted && !isDead && (
          <div className="absolute top-2 w-full text-center text-blue-300 font-bold text-xs tracking-widest uppercase animate-pulse">
            O Joca está com fome...
          </div>
        )}

        <div
          className={`flex w-full h-full gap-4 px-8 items-center justify-center ${swapButtons ? "flex-row-reverse" : "flex-row"} transition-all duration-300`}
        >
          <button
            onClick={feedRacao}
            disabled={!hasStarted || isDead}
            className={`flex-1 flex justify-center items-center h-3/4 max-w-[150px] active:scale-90 transition-transform ${!hasStarted || isDead ? "opacity-50 grayscale" : "hover:scale-105"}`}
          >
            <img
              src={racaoImg}
              alt="Dar Ração"
              className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
            />
          </button>

          <button
            onClick={feedToddy}
            disabled={!hasStarted || isDead}
            className={`flex-1 flex justify-center items-center h-3/4 max-w-[150px] active:scale-90 transition-transform ${!hasStarted || isDead ? "opacity-50 grayscale" : "hover:scale-105"}`}
          >
            <img
              src={toddyImg}
              alt="Dar Toddy"
              className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
            />
          </button>
        </div>
      </div>

      {/* MODAL DE INTRODUÇÃO (A História do Joca) */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-500">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-[0_15px_60px_-15px_rgba(0,0,0,1)] text-center border-4 border-cyan-400 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black text-cyan-600 mb-2 uppercase tracking-wide">
              O Trágico Fim do Joca 🐟🧃
            </h2>

            <p className="text-gray-700 font-medium my-4 leading-relaxed text-sm md:text-base bg-cyan-50 p-4 rounded-xl border border-cyan-100">
              Lembra do Joca? Nosso amado peixinho que vivia em paz no
              aquário... Até o dia em que você, com sua brilhante mente de
              criança, achou que a água dele estava muito "sem graça" e decidiu
              que ele merecia provar um pouco do seu achocolatado.
              <br />
              <br />
              Você literalmente achocolatou o coitado! Agora, como penitência,
              você tem a missão de alimentar um novo Joca.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 text-sm font-bold text-left text-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={racaoImg}
                  className="w-10 h-10 object-contain drop-shadow-md"
                />
                <p>
                  <span className="text-orange-500">RAÇÃO:</span> O Joca vive
                  para nadar mais um dia.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={toddyImg}
                  className="w-10 h-10 object-contain drop-shadow-md"
                />
                <p>
                  <span className="text-yellow-900">TODDY:</span> Morte
                  instantânea por overdose de chocolate. 💀
                </p>
              </div>
              <p className="mt-4 text-xs text-red-600 text-center font-black animate-pulse bg-red-100 p-2 rounded-lg">
                CUIDADO: OS BOTÕES TROCAM DE LUGAR PARA TESTAR SEUS REFLEXOS!
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-2xl font-black text-xl border-b-4 border-cyan-700 uppercase shadow-sm active:translate-y-1 active:border-b-0 transition-all"
            >
              Tentar Redimir seus Pecados 🐠
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE GAME OVER (Zueira pesada) */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in delay-500">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl text-center border-4 border-yellow-900 transform transition-all">
            <div className="w-full flex justify-center mb-6 mt-2">
              <div className="p-4 bg-blue-100 shadow-inner rounded-full border-4 border-blue-200">
                <img
                  src={peixeMorto}
                  alt="Joca Morto"
                  className="w-24 h-24 object-contain transform rotate-180 drop-shadow-lg"
                />
              </div>
            </div>

            <h2 className="text-3xl font-black text-yellow-900 mb-4 uppercase">
              VOCÊ MATOU O JOCA! DE NOVO! 🧃💀
            </h2>

            <p className="text-gray-800 font-bold mb-6 text-sm bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              A história se repete! O coitado mal teve tempo de processar o
              açúcar. Faleceu nadando em puro chocolate porque você não consegue
              distinguir comida de peixe de achocolatado. Você é um monstro!
            </p>

            <div className="bg-gray-100 p-4 mb-6 border-2 border-dashed border-gray-300 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                Dias que o Joca sobreviveu
              </p>
              <p className="text-5xl font-black text-blue-600">{score}</p>
            </div>

            <button
              onClick={restartGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm md:text-base border-b-4 border-blue-800 uppercase shadow-sm active:translate-y-1 active:border-b-0 transition-all"
            >
              Comprar outro peixe e tentar de novo 😭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
