import { useState, useEffect, useRef, useCallback } from "react";

// Importando as imagens do JOGO (tamanho normal)
import caminhando1 from "./assets/jump_game/caminhando_1.png";
import caminhando2 from "./assets/jump_game/caminhando_2.png";

import pulando1 from "./assets/jump_game/pulando_1g.png";
import pulando2 from "./assets/jump_game/pulando_2g.png";
import pulando3 from "./assets/jump_game/pulando_3g.png";
import pulando4 from "./assets/jump_game/pulando_4g.png";
import pulando5 from "./assets/jump_game/pulando_5g.png";
import pulando6 from "./assets/jump_game/pulando_6g.png";

import caindo1 from "./assets/jump_game/caindo_1.png";
import caindo2 from "./assets/jump_game/caindo_2.png";
import caindo3 from "./assets/jump_game/caindo_3.png";

// Importando as imagens GIGANTES apenas para o modal inicial
import pulando1g from "./assets/jump_game/pulando_1g.png";
import pulando2g from "./assets/jump_game/pulando_2g.png";
import pulando3g from "./assets/jump_game/pulando_3g.png";
import pulando4g from "./assets/jump_game/pulando_4g.png";
import pulando5g from "./assets/jump_game/pulando_5g.png";
import pulando6g from "./assets/jump_game/pulando_6g.png";

import finalImg from "./assets/jump_game/final.png";
import pirulitoMusic from "./assets/jump_game/pirulito.mp3";

interface Props {
  setGame: (game: string) => void;
}

export default function JumpGame({ setGame }: Props) {
  const getInitialObstaclePos = () =>
    typeof window !== "undefined" ? window.innerWidth : 800;

  const [hasStarted, setHasStarted] = useState(false);
  const [obstacleLeft, setObstacleLeft] = useState(getInitialObstaclePos());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isJumping, setIsJumping] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const jumpRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [introFrame, setIntroFrame] = useState(0);
  const [runFrame, setRunFrame] = useState(0);
  const [jumpFrame, setJumpFrame] = useState(0);
  const [fallFrame, setFallFrame] = useState(0);

  const jumpImages = [
    pulando1,
    pulando2,
    pulando3,
    pulando4,
    pulando5,
    pulando6,
  ];
  const introJumpImages = [
    pulando1g,
    pulando2g,
    pulando3g,
    pulando4g,
    pulando5g,
    pulando6g,
  ];

  useEffect(() => {
    if (hasStarted) return;
    const interval = setInterval(() => {
      setIntroFrame((prev) => (prev + 1) % 6);
    }, 120);
    return () => clearInterval(interval);
  }, [hasStarted]);

  useEffect(() => {
    if (showModal) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        // @ts-expect-error
        window.confetti({
          particleCount: 250,
          spread: 140,
          origin: { y: 0.2 },
          zIndex: 9999,
          colors: ["#FF1493", "#9400D3", "#00BFFF", "#FFD700", "#FF69B4"],
        });
      };
      document.body.appendChild(script);
    }
  }, [showModal]);

  useEffect(() => {
    if (!hasStarted || gameOver || isJumping) return;
    const interval = setInterval(() => {
      setRunFrame((prev) => (prev === 0 ? 1 : 0));
    }, 150);
    return () => clearInterval(interval);
  }, [hasStarted, gameOver, isJumping]);

  useEffect(() => {
    if (!gameOver || !hasStarted) return;
    let frame = 0;
    let timeoutId: number;

    const interval = window.setInterval(() => {
      if (frame < 2) {
        frame++;
        setFallFrame(frame);
      } else {
        window.clearInterval(interval);
        timeoutId = window.setTimeout(() => setShowModal(true), 800);
      }
    }, 150);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeoutId);
    };
  }, [gameOver, hasStarted]);

  useEffect(() => {
    let obstacleTimer: number;
    if (hasStarted && !gameOver) {
      obstacleTimer = window.setInterval(() => {
        setObstacleLeft((prev) => {
          if (prev <= -60) {
            setScore((s) => s + 1);
            return window.innerWidth + 50;
          }
          if (prev > 40 && prev < 100 && !jumpRef.current) {
            setGameOver(true);
            return prev;
          }
          return prev - (6 + Math.floor(score / 5));
        });
      }, 20);
    }
    return () => clearInterval(obstacleTimer);
  }, [hasStarted, gameOver, score]);

  const jump = useCallback(() => {
    if (!hasStarted || isJumping || gameOver) return;

    setIsJumping(true);
    setIsAscending(true);
    jumpRef.current = true;

    setJumpFrame(0);
    setTimeout(() => setJumpFrame(1), 100);
    setTimeout(() => setJumpFrame(2), 200);

    setTimeout(() => {
      setIsAscending(false);
      setJumpFrame(3);
    }, 300);

    setTimeout(() => setJumpFrame(4), 400);
    setTimeout(() => setJumpFrame(5), 500);

    setTimeout(() => {
      setIsJumping(false);
      jumpRef.current = false;
    }, 600);
  }, [hasStarted, isJumping, gameOver]);

  const startGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  let currentImage;
  if (gameOver) {
    const fallImages = [caindo1, caindo2, caindo3];
    currentImage = fallImages[fallFrame];
  } else if (isJumping) {
    currentImage = jumpImages[jumpFrame];
  } else {
    const runImages = [caminhando1, caminhando2];
    currentImage = runImages[runFrame];
  }

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-indigo-500 via-purple-400 to-pink-300 select-none cursor-pointer"
      onClick={jump}
    >
      <audio ref={audioRef} src={pirulitoMusic} loop />

      <div className="absolute top-1/4 left-10 w-32 h-8 bg-white/20 rounded-full blur-sm"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-12 bg-white/10 rounded-full blur-md"></div>
      <div className="absolute top-20 right-10 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>

      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-40 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setGame("hub");
          }}
          className="pointer-events-auto px-6 py-3 bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-extrabold rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] transition-all active:scale-95"
        >
          ← Voltar
        </button>

        <div
          className={`bg-white px-8 py-2 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] text-center flex flex-col items-center transition-opacity duration-500 ${hasStarted ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Pontuação
          </span>
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 leading-none">
            {score}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-[20vh] bg-emerald-500 border-t-8 border-emerald-400 z-10 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]">
        <p
          className={`absolute bottom-4 w-full text-center text-emerald-800/60 font-semibold text-sm animate-pulse tracking-wide pointer-events-none transition-opacity duration-500 ${hasStarted ? "opacity-100" : "opacity-0"}`}
        >
          Toque na tela ou pressione Espaço para pular
        </p>
      </div>

      <div
        className="absolute left-8 w-24 h-36 bg-contain bg-no-repeat bg-bottom z-20"
        style={{
          backgroundImage: `url(${currentImage})`,
          bottom: gameOver
            ? "20vh"
            : isAscending
              ? "calc(20vh + 160px)"
              : "20vh",
          transform: gameOver ? "translateX(80px)" : "translateX(0px)",
          transition: gameOver
            ? "bottom 300ms cubic-bezier(0.8, 0, 0.8, 0.2), transform 450ms ease-out"
            : `bottom 300ms ${isAscending ? "cubic-bezier(0.2, 0.8, 0.2, 1)" : "cubic-bezier(0.8, 0, 0.8, 0.2)"}`,
          filter: "drop-shadow(0px 10px 8px rgba(0,0,0,0.4))",
        }}
      />

      {hasStarted && (
        <div
          className="absolute w-10 h-10 bg-gradient-to-br from-red-500 to-red-800 rounded-full border-4 border-red-950 z-20 shadow-[0_4px_10px_rgba(0,0,0,0.4)] animate-[spin_0.5s_linear_infinite]"
          style={{ left: `${obstacleLeft}px`, bottom: "20vh" }}
        >
          <div className="absolute top-1 left-2 w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      )}

      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in zoom-in duration-500">
          <div
            className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-center relative overflow-hidden border-4 border-indigo-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-indigo-700 mb-2 uppercase tracking-wide">
              A História se Repete...
            </h2>

            <div className="flex justify-center my-6">
              <div
                className="w-32 h-48 bg-contain bg-no-repeat bg-bottom drop-shadow-2xl"
                style={{
                  backgroundImage: `url(${introJumpImages[introFrame]})`,
                }}
              />
            </div>

            <p className="text-gray-700 font-medium mb-4 leading-relaxed text-sm md:text-base px-2">
              Lembra quando você era pequena, saiu de casa toda serelepe
              pulando, levou aquele tombo histórico, ficou estatelada no chão e
              abriu o berreiro?
            </p>
            <p className="text-gray-700 font-medium mb-6 leading-relaxed text-sm md:text-base px-2">
              Pois é... Eu não esqueci! 😂 Transformei seu momento de glória em
              um jogo. Toque na tela ou aperte{" "}
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                ESPAÇO
              </span>{" "}
              para pular e tente não beijar o asfalto (de novo).
            </p>

            <p className="text-pink-500 font-bold mb-6 italic text-sm">
              Com zueira (mas com amor),
              <br />
              Victor.
            </p>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-2xl font-black text-lg shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] transition-all active:scale-95 animate-bounce"
            >
              Tentar a Sorte! 🚀
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE FIM DE JOGO - VISUAL PREMIUM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div
            className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 max-w-sm w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-center relative overflow-hidden transform transition-all border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decoração superior com gradiente vivo */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

            {/* Imagem estilo Polaroid com rotação e sombra */}
            <div className="w-full flex justify-center mb-6 mt-4">
              <div className="p-3 bg-white rounded-2xl shadow-xl transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300 border border-gray-100">
                <img
                  src={finalImg}
                  alt="Brunna caída"
                  className="w-full max-h-40 object-contain rounded-lg bg-gray-50/50"
                />
              </div>
            </div>

            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2 leading-tight drop-shadow-sm">
              Parabéns, Brunna!
            </h2>

            <p className="text-gray-600 font-semibold mb-6 leading-relaxed text-sm md:text-base px-2">
              A prova viva de que você continua caindo na vida, mas pelo menos
              hoje tem bolo! 🎂 Felicidades!
            </p>

            {/* Caixa de pontuação com gradiente suave */}
            <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-3xl p-5 mb-8 border border-indigo-100 shadow-inner">
              <p className="text-xs text-indigo-400 uppercase tracking-widest font-black mb-1">
                Pontuação Final
              </p>
              <p className="text-6xl font-black text-indigo-600 drop-shadow-sm animate-pulse">
                {score}
              </p>
            </div>

            <button
              onClick={() => {
                setScore(0);
                setObstacleLeft(window.innerWidth + 50);
                setFallFrame(0);
                setGameOver(false);
                setShowModal(false);
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-2xl font-extrabold text-lg shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              Tentar Novamente{" "}
              <span className="group-hover:animate-spin">🎮</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
