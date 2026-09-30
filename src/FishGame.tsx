import { useState, useEffect, useRef } from "react";

// Importando as imagens
import peixeVivo from "./assets/jump_game/peixe_vivo.png";
import peixeMorto from "./assets/jump_game/peixe_morto.png";
import toddyImg from "./assets/jump_game/toddy.png";
import racaoImg from "./assets/jump_game/racao_peixe.png";

// Importando os áudios
import tristezaSound from "./assets/jump_game/tristeza.mp3";
import peixeMusic from "./assets/jump_game/peixe.mp3";

interface Props {
  setGame: (game: string) => void;
}

export default function FishGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  const [isDead, setIsDead] = useState(false);
  const [fishPos, setFishPos] = useState({ x: 50, y: 50, flip: false });

  const [feedEffects, setFeedEffects] = useState<
    { id: number; type: "racao" | "toddy"; x: number }[]
  >([]);
  const [swapButtons, setSwapButtons] = useState(false);

  const tristezaRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);

  // Timer regressivo de 30 segundos
  useEffect(() => {
    if (!hasStarted || gameOver || isTimeOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeOut(true);
          setGameOver(true);

          if (bgMusicRef.current) bgMusicRef.current.pause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, gameOver, isTimeOut]);

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
    if (isDead || !hasStarted || gameOver) return;

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
    if (isDead || !hasStarted || gameOver) return;

    const newId = Date.now() + Math.random();
    setFeedEffects((prev) => [
      ...prev,
      { id: newId, type: "toddy", x: fishPos.x },
    ]);

    setIsDead(true);

    if (bgMusicRef.current) bgMusicRef.current.pause();

    if (tristezaRef.current) {
      tristezaRef.current.currentTime = 0;
      tristezaRef.current.play().catch(() => {});
    }

    setFishPos((prev) => ({ ...prev, y: 10 }));

    setTimeout(() => {
      setGameOver(true);
    }, 1500);
  };

  const startGame = () => {
    setHasStarted(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.35;
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsTimeOut(false);
    setIsDead(false);
    setGameOver(false);
    setSwapButtons(false);
    setFeedEffects([]);
    setFishPos({ x: 50, y: 50, flip: false });

    if (tristezaRef.current) {
      tristezaRef.current.pause();
      tristezaRef.current.currentTime = 0;
    }

    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden select-none touch-none bg-blue-950 font-sans flex flex-col">
      <audio ref={bgMusicRef} src={peixeMusic} loop />
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

        {/* UI Superior */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40">
          <button
            onClick={() => setGame("hub")}
            className="px-5 py-2 bg-white/90 text-blue-700 font-extrabold rounded-full shadow-lg active:scale-95 transition-all text-sm"
          >
            ← Voltar
          </button>

          {hasStarted && (
            <div className="flex gap-2">
              <div
                className={`bg-white/95 px-4 py-2 rounded-2xl shadow-lg text-center flex flex-col items-center ${
                  timeLeft <= 5 ? "animate-pulse border-2 border-red-500" : ""
                }`}
              >
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Tempo
                </span>
                <span
                  className={`text-2xl font-black leading-none ${
                    timeLeft <= 5 ? "text-red-600" : "text-amber-500"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>

              <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-lg text-center flex flex-col items-center">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Dias Vivo
                </span>
                <span className="text-2xl font-black text-blue-700 leading-none">
                  {score}
                </span>
              </div>
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
            transform: `translate(-50%, -50%) ${
              isDead
                ? "rotate(180deg)"
                : fishPos.flip
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)"
            }`,
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
        {hasStarted && !isDead && !gameOver && (
          <div className="absolute top-2 w-full text-center text-blue-300 font-bold text-xs tracking-widest uppercase animate-pulse">
            O Joca está com fome... rápido!
          </div>
        )}

        <div
          className={`flex w-full h-full gap-4 px-8 items-center justify-center ${
            swapButtons ? "flex-row-reverse" : "flex-row"
          } transition-all duration-300`}
        >
          <button
            onClick={feedRacao}
            disabled={!hasStarted || isDead || gameOver}
            className={`flex-1 flex justify-center items-center h-3/4 max-w-[150px] active:scale-90 transition-transform ${
              !hasStarted || isDead || gameOver
                ? "opacity-50 grayscale"
                : "hover:scale-105"
            }`}
          >
            <img
              src={racaoImg}
              alt="Dar Ração"
              className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
            />
          </button>

          <button
            onClick={feedToddy}
            disabled={!hasStarted || isDead || gameOver}
            className={`flex-1 flex justify-center items-center h-3/4 max-w-[150px] active:scale-90 transition-transform ${
              !hasStarted || isDead || gameOver
                ? "opacity-50 grayscale"
                : "hover:scale-105"
            }`}
          >
            <img
              src={toddyImg}
              alt="Dar Toddy"
              className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
            />
          </button>
        </div>
      </div>

      {/* MODAL DE INTRODUÇÃO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-500">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-[0_15px_60px_-15px_rgba(0,0,0,1)] text-center border-4 border-cyan-400 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black text-cyan-600 mb-2 uppercase tracking-wide">
              O Trágico Fim do Joca 🐟🧃
            </h2>

            <p className="text-gray-700 font-medium my-4 leading-relaxed text-sm md:text-base bg-cyan-50 p-4 rounded-xl border border-cyan-100">
              Você tem apenas{" "}
              <span className="font-black text-cyan-700">30 segundos</span> para
              alimentar o Joca o máximo que conseguir sem deixar ele provar
              achocolatado de novo!
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 text-sm font-bold text-left text-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={racaoImg}
                  className="w-10 h-10 object-contain drop-shadow-md"
                  alt="Ração"
                />
                <p>
                  <span className="text-orange-500">RAÇÃO:</span> +1 dia de vida
                  para o Joca.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={toddyImg}
                  className="w-10 h-10 object-contain drop-shadow-md"
                  alt="Toddy"
                />
                <p>
                  <span className="text-yellow-900">TODDY:</span> Overdose de
                  chocolate imediata. 💀
                </p>
              </div>
              <p className="mt-4 text-xs text-red-600 text-center font-black animate-pulse bg-red-100 p-2 rounded-lg">
                CUIDADO: OS BOTÕES TROCAM DE LUGAR EM ALTA VELOCIDADE!
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-2xl font-black text-xl border-b-4 border-cyan-700 uppercase shadow-sm active:translate-y-1 active:border-b-0 transition-all"
            >
              Iniciar Corrida (30s) ⏱️
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE FIM DE JOGO - REDESIGN MODERNO */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-5 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-7 md:p-8 max-w-sm w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] text-center flex flex-col items-center border border-slate-100">
            {/* Avatar em Destaque */}
            <div className="mb-5 relative">
              <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80">
                <img
                  src={isTimeOut && !isDead ? peixeVivo : peixeMorto}
                  alt="Status do Joca"
                  className={`w-28 h-28 object-contain transition-transform duration-300 drop-shadow-md ${
                    isDead ? "rotate-180 scale-105" : "scale-100"
                  }`}
                />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {isTimeOut && !isDead ? "Tempo Esgotado" : "Você Matou o Joca"}
            </h2>

            {/* Descrição */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 w-full border border-slate-100">
              <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">
                {isTimeOut && !isDead
                  ? "Os 30 segundos acabaram e você conseguiu mantê-lo vivo longe do Toddy!"
                  : "Faleceu afogado em puro achocolatado mais uma vez. O trauma de infância segue intacto."}
              </p>
            </div>

            {/* Placar Minimalista */}
            <div className="flex flex-col items-center justify-center mb-7">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Dias Sobrevividos
              </span>
              <span className="text-5xl font-black text-blue-600 tracking-tight leading-none">
                {score}
              </span>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={restartGame}
                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
              >
                Tentar de Novo
              </button>

              <button
                onClick={() => setGame("hub")}
                className="w-full bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-600 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
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
