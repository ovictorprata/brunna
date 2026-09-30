import { useState, useEffect, useRef, useCallback } from "react";

// Imagens da Brunna
import bebe1 from "./assets/jump_game/bebe_1.png";
import bebe2 from "./assets/jump_game/bebe_2.png";
import bebeParada from "./assets/jump_game/bebe_parada.png";

// Imagens do Victor (O Chefão Ciumento)
import victorVirado from "./assets/jump_game/victor_virado.png";
import victorVirando from "./assets/jump_game/victor_virando.png";
import victorOlhando from "./assets/jump_game/victor_olhando.png";

// O pé esmagador
import peGigante from "./assets/jump_game/pe_gigante.png";

// Áudios
import babyMusic from "./assets/jump_game/baby.mp3";
import tristezaSound from "./assets/jump_game/tristeza.mp3";
import parabensSound from "./assets/jump_game/parabens.mp3";

import bebeChorando from "./assets/jump_game/baby_chorando.png";
import bebeChorandoSound from "./assets/jump_game/bebe_chorando.mp3";

interface Props {
  setGame: (game: string) => void;
}

type VictorState = "DISTRAIDO" | "AVISO" | "OLHANDO";

export default function BabyGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Progresso de 0 a 100% (Agora movendo de baixo para cima)
  const [progress, setProgress] = useState(0);

  const [isSmashed, setIsSmashed] = useState(false);
  const [isCrying, setIsCrying] = useState(false);
  const bebeChorandoRef = useRef<HTMLAudioElement>(null);

  // Controles
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlFrame, setCrawlFrame] = useState(0);

  // A Mente do Irmão Ciumento
  const [victorState, setVictorState] = useState<VictorState>("DISTRAIDO");

  // Refs
  const isCrawlingRef = useRef(false);
  const victorStateRef = useRef<VictorState>("DISTRAIDO");
  const progressRef = useRef(0);

  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const tristezaRef = useRef<HTMLAudioElement>(null);
  const parabensRef = useRef<HTMLAudioElement>(null);

  // Sincroniza o estado com a ref
  useEffect(() => {
    isCrawlingRef.current = isCrawling;
  }, [isCrawling]);

  useEffect(() => {
    victorStateRef.current = victorState;
  }, [victorState]);

  // Animação de Engatinhar
  useEffect(() => {
    if (!hasStarted || gameOver || gameWon) return;
    const interval = setInterval(() => {
      if (isCrawlingRef.current) {
        setCrawlFrame((prev) => (prev === 0 ? 1 : 0));
      }
    }, 150);
    return () => clearInterval(interval);
  }, [hasStarted, gameOver, gameWon]);

  // A LÓGICA DO IRMÃO (Muito mais difícil e rápido!)
  useEffect(() => {
    if (!hasStarted || gameOver || gameWon) return;

    let timeoutId: number;

    const runVictorLogic = () => {
      const state = victorStateRef.current;

      if (state === "DISTRAIDO") {
        // Fica de costas por menos tempo (ex: entre 0.8s e 1.8s em vez de 1.5s e 3.5s)
        timeoutId = window.setTimeout(
          () => {
            setVictorState("AVISO");
            runVictorLogic();
          },
          Math.random() * 300 + 500,
        );
      } else if (state === "AVISO") {
        // Transição de virada super rápida (ex: 150ms a 200ms em vez de 400ms)
        timeoutId = window.setTimeout(() => {
          setVictorState("OLHANDO");
          runVictorLogic();
        }, 200);
      } else if (state === "OLHANDO") {
        // Tempo em que ele fica encarando (ex: entre 0.8s e 1.5s)
        timeoutId = window.setTimeout(
          () => {
            setVictorState("DISTRAIDO");
            runVictorLogic();
          },
          Math.random() * 700 + 800,
        );
      }
    };

    runVictorLogic();

    return () => clearTimeout(timeoutId);
  }, [hasStarted, gameOver, gameWon]);

  // Motor Principal: Movimento e Esmagamento
  useEffect(() => {
    if (!hasStarted || gameOver || gameWon) return;

    const gameLoop = setInterval(() => {
      // 1. O PISÃO! Se ela se mexer enquanto o Victor olha...
      if (isCrawlingRef.current && victorStateRef.current === "OLHANDO") {
        clearInterval(gameLoop);

        // 1. O pé desce imediatamente para pisar
        setIsSmashed(true);

        if (bgMusicRef.current) bgMusicRef.current.pause();
        if (tristezaRef.current) {
          tristezaRef.current.currentTime = 0;
          tristezaRef.current.play().catch(() => {});
        }

        // 2. Após 0.8s, o pé sobe/desaparece e a bebê começa a chorar
        setTimeout(() => {
          setIsSmashed(false);
          setIsCrying(true);
        }, 800);

        // 3. Após 2.5s (dando tempo para ver a bebê chorando na tela), abre o modal e toca o som
        setTimeout(() => {
          setGameOver(true);
          if (bebeChorandoRef.current) {
            bebeChorandoRef.current.currentTime = 0;
            bebeChorandoRef.current.play().catch(() => {});
          }
        }, 3500);

        return;
      }

      // 2. Movimento Seguro
      if (isCrawlingRef.current) {
        progressRef.current += 0.35; // Escala de velocidade ajustada para a vertical
        setProgress(progressRef.current);

        // Venceu ao chegar a 100% (Chegou no irmão)
        if (progressRef.current >= 100) {
          setGameWon(true);
          if (bgMusicRef.current) bgMusicRef.current.pause();
          if (parabensRef.current) {
            parabensRef.current.currentTime = 0;
            parabensRef.current.play().catch(() => {});
          }
          clearInterval(gameLoop);
        }
      }
    }, 30);

    return () => clearInterval(gameLoop);
  }, [hasStarted, gameOver, gameWon]);

  // Controles
  const startCrawling = useCallback(
    (e?: React.SyntheticEvent | KeyboardEvent) => {
      if (e && "preventDefault" in e && e.type !== "touchstart")
        e.preventDefault();
      if (!hasStarted || gameOver || gameWon) return;
      setIsCrawling(true);
    },
    [hasStarted, gameOver, gameWon],
  );

  const stopCrawling = useCallback(
    (e?: React.SyntheticEvent | KeyboardEvent) => {
      if (e && "preventDefault" in e && e.type !== "touchend")
        e.preventDefault();
      setIsCrawling(false);
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") startCrawling(e);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") stopCrawling(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startCrawling, stopCrawling]);

  // Efeito Confetes
  useEffect(() => {
    if (gameWon) {
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
        });
      };
      document.body.appendChild(script);
    }
  }, [gameWon]);

  // Funções de Inicialização e Reinício
  const startGame = () => {
    setHasStarted(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.3;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  const restartGame = () => {
    progressRef.current = 0;
    setProgress(0);
    setIsCrawling(false);
    setIsSmashed(false); // Reseta a animação do pé
    setIsCrying(false); // Reseta o estado do choro
    setVictorState("DISTRAIDO");
    victorStateRef.current = "DISTRAIDO";
    setGameOver(false);
    setGameWon(false);

    if (bebeChorandoRef.current) {
      bebeChorandoRef.current.pause();
    }

    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  // Define as imagens atuais
  let currentBabyImage = bebeParada;
  if (isCrying) {
    currentBabyImage = bebeChorando;
  } else if (isCrawling) {
    currentBabyImage = crawlFrame === 0 ? bebe1 : bebe2;
  }

  let currentVictorImage = victorVirado;
  if (victorState === "AVISO") currentVictorImage = victorVirando;
  if (victorState === "OLHANDO") currentVictorImage = victorOlhando;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-rose-100 select-none touch-none font-sans flex flex-col items-center">
      <audio ref={bgMusicRef} src={babyMusic} loop />
      <audio ref={tristezaRef} src={tristezaSound} />
      <audio ref={parabensRef} src={parabensSound} />
      <audio ref={bebeChorandoRef} src={bebeChorandoSound} />

      {/* Cenário: Chão de Madeira estilo corredor */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #fcd34d, #fcd34d 40px, #f59e0b 40px, #f59e0b 42px)",
        }}
      ></div>

      {/* Voltar */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setGame("hub")}
          className="px-6 py-2 bg-white text-rose-600 font-bold rounded-full shadow-lg border-2 border-rose-200 active:scale-95 transition-all"
        >
          ← Voltar
        </button>
      </div>

      {/* VICTOR NO TOPO DA TELA (O Chefão) */}
      <div className="absolute top-[8vh] w-full flex justify-center z-30">
        {/* Balão de Status (Opcional, mas ajuda muito na tensão) */}
        {hasStarted && !gameOver && !gameWon && (
          <div className="absolute -bottom-8 bg-white/90 px-4 py-1 rounded-full text-xs font-black shadow-md uppercase tracking-wider">
            {victorState === "DISTRAIDO" && (
              <span className="text-green-500">Avança!</span>
            )}
            {victorState === "AVISO" && (
              <span className="text-yellow-500">⚠️ Virando!</span>
            )}
            {victorState === "OLHANDO" && (
              <span className="text-red-600">NÃO MEXE!</span>
            )}
          </div>
        )}

        {/* A Imagem do Irmão */}
        <div
          className="w-32 h-32 md:w-40 md:h-40 bg-contain bg-no-repeat bg-bottom drop-shadow-2xl transition-transform duration-100"
          style={{ backgroundImage: `url(${currentVictorImage})` }}
        />
      </div>

      {/* Linha de Chegada Horizontal */}
      <div className="absolute top-[28vh] w-[80%] max-w-lg h-2 border-t-8 border-dashed border-indigo-400 z-10 flex justify-end items-center opacity-70">
        <span className="bg-indigo-100 text-indigo-500 font-black px-2 py-1 rounded-bl-lg text-sm tracking-widest mt-6">
          CHEGADA
        </span>
      </div>

      {/* A Personagem (Baby Brunna) movendo-se na VERTICAL */}
      <div
        className="absolute w-24 h-24 md:w-32 md:h-32 bg-contain bg-no-repeat bg-bottom z-20 transition-all duration-75"
        style={{
          backgroundImage: `url(${currentBabyImage})`,
          // Começa em 15vh da base e sobe até ~75vh (linha de chegada)
          bottom: `calc(15vh + ${progress * 0.58}vh)`,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* BOTÃO DE CONTROLE FIXO NA BASE */}
      {hasStarted && !gameOver && !gameWon && (
        <div className="absolute bottom-6 w-full flex justify-center z-40 px-4 pb-safe">
          <button
            onMouseDown={startCrawling}
            onMouseUp={stopCrawling}
            onMouseLeave={stopCrawling}
            onTouchStart={startCrawling}
            onTouchEnd={stopCrawling}
            className={`w-full max-w-sm py-6 rounded-[2rem] font-black text-2xl uppercase shadow-[0_10px_0_0_rgba(190,24,93,1)] transition-all select-none touch-manipulation ${
              isCrawling
                ? "bg-rose-600 text-white translate-y-2 shadow-none"
                : "bg-rose-500 text-white active:translate-y-2 active:shadow-none"
            }`}
          >
            {isCrawling ? "ENGATINHANDO..." : "SEGURE P/ ANDAR"}
          </button>
        </div>
      )}

      <div
        className="absolute w-40 h-80 bg-contain bg-no-repeat bg-bottom z-50 transition-all duration-150 ease-in pointer-events-none drop-shadow-2xl"
        style={{
          backgroundImage: `url(${peGigante})`,
          left: "50%",
          transform: "translateX(-50%)",
          // O pé desce assim que o isSmashed for verdadeiro
          bottom: isSmashed ? `calc(15vh + ${progress * 0.58}vh)` : "100vh",
          opacity: isSmashed ? 1 : 0,
        }}
      />

      {/* MODAL DE INTRODUÇÃO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in zoom-in">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl text-center border-4 border-rose-400 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black text-rose-600 mb-2 uppercase tracking-wide">
              Os Primeiros Passos 🍼
            </h2>

            <p className="text-gray-700 font-medium my-4 leading-relaxed text-sm md:text-base bg-rose-50 p-4 rounded-xl border border-rose-100">
              Quando você começou a dar os primeiros passos e a engatinhar,
              espalharam a mentira que eu, tão bonzinho, fiquei com ciúmes que
              você estava aprendendo a andar...
              <br />
              <br />A minha solução?{" "}
              <span className="font-bold text-rose-600">
                Pisar no seu pé para você não sair do lugar! 😂
              </span>
              <br />
              <br />
              Segure o botão para engatinhar, mas cuidado: se você se mexer
              enquanto eu estiver olhando, eu PISO! 🦶
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 text-sm font-bold text-left text-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={victorVirado}
                  className="w-10 h-10 object-contain bg-green-100 rounded-full border border-green-300"
                />
                <p>
                  De costas:{" "}
                  <span className="text-green-600">Pode avançar!</span>
                </p>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={victorVirando}
                  className="w-10 h-10 object-contain bg-yellow-100 rounded-full border border-yellow-300"
                />
                <p>
                  Virando:{" "}
                  <span className="text-yellow-600">SOLTE O BOTÃO RÁPIDO!</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={victorOlhando}
                  className="w-10 h-10 object-contain bg-red-100 rounded-full border border-red-300"
                />
                <p>
                  Olhando:{" "}
                  <span className="text-red-600">Se mexer, eu PISO! 🦶</span>
                </p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_0_rgba(159,18,57,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Tentar Aprender a Andar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE GAME OVER */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in delay-700">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl text-center border-4 border-red-600 transform transition-all">
            <h2 className="text-4xl font-black text-red-600 mb-4 uppercase italic">
              SMASH! 🦶
            </h2>

            <p className="text-gray-800 font-bold mb-6 text-lg bg-gray-100 p-4 rounded-xl border border-gray-300">
              Pisei no seu pé! Você se mexeu bem na hora que eu estava olhando.
              O ciúme falou mais alto. Ainda bem que eu sou um anjinho e jamais
              faria isso.
              <br />
              <br />
              <span className="text-sm font-normal text-gray-600">
                Chore um pouquinho e tente de novo.
              </span>
            </p>

            <button
              onClick={restartGame}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_0_rgba(153,27,27,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Chorar e Tentar Novamente 😭
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE VITÓRIA */}
      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl text-center border-4 border-indigo-400">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl shadow-inner border border-indigo-200">
              🎉
            </div>

            <h2 className="text-3xl font-black text-indigo-600 mb-4 uppercase">
              AEEE! VOCÊ CONSEGUIU!
            </h2>

            <p className="text-gray-700 font-bold mb-6 text-sm bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              Você escapou dos meus pisões, driblou o ciúme e finalmente
              aprendeu a andar pela casa!
              <br />
              <br />
              <span className="text-indigo-800 italic">
                (Mas eu ainda sou o irmão mais legal. Feliz Aniversário!)
              </span>
            </p>

            <button
              onClick={restartGame}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_0_rgba(55,48,163,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Relembrar o trauma 🍼
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
