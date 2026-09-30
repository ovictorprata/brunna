import { useState, useEffect, useRef, useCallback } from "react";

// Importando as imagens
import camisaAmarela from "./assets/jump_game/camisa_amarela.png";
import camisaBranca from "./assets/jump_game/camisa_branca.png";
import brunnaCesto from "./assets/jump_game/brunna_cesto.png";
import camisaChorando from "./assets/jump_game/camisa_branca_chorando.png";

// Importando os áudios
import tristezaSound from "./assets/jump_game/tristeza.mp3";
import parabensSound from "./assets/jump_game/parabens.mp3";
import copaMusic from "./assets/jump_game/copa.mp3"; // NOVA MÚSICA DE FUNDO

interface Props {
  setGame: (game: string) => void;
}

export default function CopaGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);

  // Posição da Brunna
  const [playerPos, setPlayerPos] = useState(50);
  const playerPosRef = useRef(50);
  const scoreRef = useRef(0);

  // Áudios
  const tristezaRef = useRef<HTMLAudioElement>(null);
  const parabensRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null); // Ref para a música da Copa

  // Lista de camisas
  const [shirts, setShirts] = useState<any[]>([]);
  const shirtsRef = useRef<any[]>([]);

  // Dispara o som de derrota e pausa a música de fundo
  useEffect(() => {
    if (gameOver) {
      if (bgMusicRef.current) bgMusicRef.current.pause();
      if (tristezaRef.current) {
        tristezaRef.current.currentTime = 0;
        tristezaRef.current.play().catch(() => {});
      }
    }
  }, [gameOver]);

  // Dispara o som de vitória, pausa a música de fundo e solta confetes
  useEffect(() => {
    if (gameWon) {
      if (bgMusicRef.current) bgMusicRef.current.pause();
      if (parabensRef.current) {
        parabensRef.current.currentTime = 0;
        parabensRef.current.play().catch(() => {});
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        // @ts-expect-error
        window.confetti({
          particleCount: 300,
          spread: 160,
          origin: { y: 0.2 },
          zIndex: 9999,
          colors: ["#fde047", "#16a34a", "#0284c7", "#ffffff"],
        });
      };
      document.body.appendChild(script);
    }
  }, [gameWon]);

  // Motor Principal do Jogo (Física e Colisões)
  useEffect(() => {
    if (!hasStarted || gameOver || gameWon) return;

    let speedMultiplier = 1;

    const gameLoop = setInterval(() => {
      let isDead = false;
      let isVictorious = false;

      speedMultiplier = 1 + scoreRef.current / 15;

      shirtsRef.current = shirtsRef.current
        .map((shirt) => ({
          ...shirt,
          y: shirt.y + 1.5 * speedMultiplier,
        }))
        .filter((shirt) => {
          if (shirt.y > 82 && shirt.y < 88) {
            if (Math.abs(shirt.x - playerPosRef.current) < 6) {
              if (shirt.type === "white") {
                isDead = true;
              } else {
                scoreRef.current += 1;
                setScore(scoreRef.current);
                if (scoreRef.current >= 15) {
                  isVictorious = true;
                }
              }
              return false;
            }
          }
          return shirt.y < 110;
        });

      if (isDead) {
        setGameOver(true);
      } else if (isVictorious) {
        setGameWon(true);
      } else {
        setShirts([...shirtsRef.current]);
      }
    }, 30);

    return () => clearInterval(gameLoop);
  }, [hasStarted, gameOver, gameWon]);

  // Gerador de Camisas
  useEffect(() => {
    if (!hasStarted || gameOver || gameWon) return;

    const spawner = setInterval(() => {
      const isWhite = Math.random() < 0.35;

      shirtsRef.current.push({
        id: Date.now() + Math.random(),
        type: isWhite ? "white" : "yellow",
        x: Math.floor(Math.random() * 80) + 10,
        y: -10,
      });
    }, 900);

    return () => clearInterval(spawner);
  }, [hasStarted, gameOver, gameWon]);

  // Controles
  const handleMove = useCallback(
    (clientX: number) => {
      if (gameOver || gameWon || !hasStarted) return;
      const w = window.innerWidth;
      const percentage = (clientX / w) * 100;
      const clampedPos = Math.max(5, Math.min(95, percentage));
      playerPosRef.current = clampedPos;
      setPlayerPos(clampedPos);
    },
    [gameOver, gameWon, hasStarted],
  );

  // Iniciar ou Reiniciar o Jogo (Controla a música da Copa)
  const startGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasStarted(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  const restartGame = () => {
    scoreRef.current = 0;
    setScore(0);
    shirtsRef.current = [];
    setShirts([]);
    setGameOver(false);
    setGameWon(false);

    // Retoma a música de fundo
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden select-none touch-none"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, #22c55e, #22c55e 10%, #16a34a 10%, #16a34a 20%)",
        imageRendering: "pixelated",
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* Elementos de Áudio */}
      <audio ref={bgMusicRef} src={copaMusic} loop />
      <audio ref={tristezaRef} src={tristezaSound} />
      <audio ref={parabensRef} src={parabensSound} />

      {/* Marcações do Campo de Futebol em 8-bits */}
      <div className="absolute inset-x-6 inset-y-8 border-4 border-white/70 pointer-events-none"></div>
      <div className="absolute top-1/2 left-6 right-6 h-1 border-t-4 border-white/70 pointer-events-none -translate-y-1/2"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white/70 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/70 pointer-events-none"></div>

      <div className="absolute top-8 left-1/4 right-1/4 h-24 border-x-4 border-b-4 border-white/70 pointer-events-none"></div>
      <div className="absolute bottom-8 left-1/4 right-1/4 h-24 border-x-4 border-t-4 border-white/70 pointer-events-none"></div>

      {/* UI Superior */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setGame("hub");
          }}
          className="pointer-events-auto px-6 py-2 bg-white/90 text-green-700 font-extrabold shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] border-2 border-green-800 transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          ← VOLTAR
        </button>

        <div
          className={`bg-white/90 px-6 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] border-2 border-green-800 text-center flex flex-col items-center transition-opacity duration-500 ${hasStarted ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
            PLACAR
          </span>
          <span className="text-3xl font-black text-green-600 leading-none">
            {score}/15
          </span>
        </div>
      </div>

      {/* A Personagem (Brunna) */}
      <div
        className="absolute w-24 h-36 bg-contain bg-no-repeat bg-bottom z-20 transition-transform duration-75"
        style={{
          backgroundImage: `url(${brunnaCesto})`,
          left: `${playerPos}%`,
          bottom: "12vh",
          transform: "translateX(-50%)",
          filter: "drop-shadow(0px 8px 6px rgba(0,0,0,0.4))",
        }}
      />

      {/* Camisas a cair */}
      {shirts.map((shirt) => (
        <div
          key={shirt.id}
          className="absolute z-30 transition-transform duration-75 drop-shadow-xl"
          style={{
            left: `${shirt.x}%`,
            top: `${shirt.y}%`,
            transform: "translateX(-50%)",
          }}
        >
          <img
            src={shirt.type === "yellow" ? camisaAmarela : camisaBranca}
            alt="camisa"
            className="w-14 h-14 object-contain"
          />
        </div>
      ))}

      {/* MODAL DE INTRODUÇÃO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in zoom-in duration-500">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-[8px_8px_0_0_rgba(234,179,8,1)] border-4 border-green-700 text-center">
            <h2 className="text-2xl font-black text-green-700 mb-2 uppercase tracking-wide">
              O Trauma da Copa! 🇧🇷
            </h2>

            {/* Novas Copys Aplicadas */}
            <p className="text-gray-700 font-medium my-6 leading-relaxed text-sm md:text-base bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300">
              Tia Mônica saiu correndo do trabalho para ir no Betânia comprar
              uma camisa para você assistir ao jogo da Copa... Mas adivinha a
              cor que ela escolheu? 💀
            </p>

            <div className="flex flex-col gap-3 mb-6 bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 text-sm font-bold text-gray-800 text-left">
              <div className="flex items-center gap-3">
                <img src={camisaAmarela} className="w-8 h-8 object-contain" />
                <span className="text-green-700">
                  Pegue as amarelas (Tem que pegar 15)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img src={camisaBranca} className="w-8 h-8 object-contain" />
                <span className="text-red-600">
                  Se pegar uma camisa branca você CHORA!
                </span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 font-black text-xl border-b-4 border-green-700 uppercase shadow-sm active:translate-y-1 active:border-b-0 transition-all"
            >
              Ir para o Jogo! 🏃‍♀️
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE VITÓRIA (Parabéns + Confetes) */}
      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl p-8 max-w-sm w-full shadow-[8px_8px_0_0_rgba(22,163,74,1)] border-4 border-green-500 text-center transform transition-all">
            <div className="w-24 h-24 bg-green-100 flex items-center justify-center mx-auto mb-4 text-6xl border-4 border-green-300 rounded-full">
              🏆
            </div>

            <h2 className="text-3xl font-black text-green-700 mb-4 leading-tight uppercase">
              Parabéns, Brunna!
            </h2>

            <p className="text-gray-700 font-bold mb-6 leading-relaxed text-sm px-2">
              Finalmente conseguiste uma camisa amarela para ver o jogo em paz!
              Feliz aniversário e que a vida te dê menos camisas da Betânia!
              🎂💚💛
            </p>

            <button
              onClick={restartGame}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-900 py-4 font-black text-xl border-b-4 border-yellow-600 uppercase shadow-sm active:translate-y-1 active:border-b-0 transition-all"
            >
              Jogar de Novo 🇧🇷
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE FIM DE JOGO (O Chilique) */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-[8px_8px_0_0_rgba(220,38,38,1)] border-4 border-red-600 text-center transform transition-all">
            <div className="w-full flex justify-center mb-6 mt-2">
              <div className="p-3 bg-white shadow-lg transform rotate-[-3deg] border-4 border-red-100">
                <img
                  src={camisaChorando}
                  alt="Brunna chorando com a camisa branca"
                  className="w-full max-h-48 object-contain bg-gray-50"
                />
              </div>
            </div>

            <h2 className="text-xl font-black text-red-600 mb-6 leading-tight italic">
              "Como é que você teve coragem de comprar isso pra mim?
              Horrorosa...essa camiseta horrosa logo para mim???"
            </h2>

            <div className="bg-gray-100 p-4 mb-6 border-2 border-dashed border-gray-300">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                Camisas Amarelas Salvas
              </p>
              <p className="text-5xl font-black text-red-600">{score}</p>
            </div>

            <button
              onClick={restartGame}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 font-black text-xl border-b-4 border-red-700 uppercase shadow-sm active:translate-y-1 active:border-b-0 transition-all"
            >
              Tentar de novo 😭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
