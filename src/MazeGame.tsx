import { useState, useEffect, useRef, useCallback } from "react";

// Imagens do jogo
import rostoImg from "./assets/maze_game/rosto.png";
import shoppingImg from "./assets/maze_game/shopping.png";

// Áudios
import victoriaSound from "./assets/jump_game/parabens.mp3";
import labirintoMusic from "./assets/maze_game/labirinto.mp3";

interface Props {
  setGame: (game: string) => void;
}

// Grid do Labirinto Vertical (11 colunas x 15 linhas)
const MAZE_GRID = [
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Entrada no topo (0, 1)
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], // Saída na base (14, 7)
];

const START_POS = { row: 0, col: 1 };
const END_POS = { row: 14, col: 7 };

export default function MazeGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const parabensRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const playerPosRef = useRef(playerPos);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  const movePlayer = useCallback(
    (dRow: number, dCol: number) => {
      if (!hasStarted || gameWon) return;

      const newRow = playerPosRef.current.row + dRow;
      const newCol = playerPosRef.current.col + dCol;

      if (
        newRow < 0 ||
        newRow >= MAZE_GRID.length ||
        newCol < 0 ||
        newCol >= MAZE_GRID[0].length
      ) {
        return;
      }

      if (MAZE_GRID[newRow][newCol] === 1) {
        return;
      }

      setPlayerPos({ row: newRow, col: newCol });
      setMoves((prev) => prev + 1);

      if (newRow === END_POS.row && newCol === END_POS.col) {
        setGameWon(true);

        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
        }

        if (parabensRef.current) {
          parabensRef.current.currentTime = 0;
          parabensRef.current.play().catch(() => {});
        }
      }
    },
    [hasStarted, gameWon],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W")
        movePlayer(-1, 0);
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S")
        movePlayer(1, 0);
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        movePlayer(0, -1);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        movePlayer(0, 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    if (gameWon) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        // @ts-expect-error
        window.confetti({
          particleCount: 250,
          spread: 140,
          origin: { y: 0.3 },
          zIndex: 9999,
        });
      };
      document.body.appendChild(script);
    }
  }, [gameWon]);

  const startGame = () => {
    setHasStarted(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.35;
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  const restartGame = () => {
    setPlayerPos(START_POS);
    setGameWon(false);
    setMoves(0);

    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-stone-100 select-none touch-none font-sans flex flex-col items-center justify-between p-2">
      <audio ref={bgMusicRef} src={labirintoMusic} loop />
      <audio ref={parabensRef} src={victoriaSound} />

      {/* HEADER COMPACTO */}
      <div className="w-full max-w-xs flex flex-col items-center gap-0.5 z-30 pt-1 shrink-0">
        <button
          onClick={() => setGame("hub")}
          className="text-stone-400 hover:text-stone-800 font-bold text-[11px] uppercase tracking-widest transition-colors py-0.5 px-3 rounded-full active:scale-95"
        >
          ◄ Voltar ao Menu
        </button>

        <div className="flex items-center gap-1.5 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
          <span>Passos</span>
          <span className="bg-white px-2 py-0.2 rounded-full shadow-sm text-stone-900 font-black border border-stone-200">
            {moves}
          </span>
        </div>
      </div>

      {/* ÁREA CENTRAL: LABIRINTO COM ALTURA LIMITADA À TELA */}
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 py-1">
        {/* Labirinto proporcional que nunca vaza da tela */}
        <div className="h-full max-h-[46vh] aspect-[11/15] bg-slate-950 p-1.5 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-center shrink-0">
          <div
            className="w-full h-full grid gap-0 rounded-xl overflow-hidden border border-slate-800/80"
            style={{
              gridTemplateColumns: `repeat(${MAZE_GRID[0].length}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${MAZE_GRID.length}, minmax(0, 1fr))`,
            }}
          >
            {MAZE_GRID.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isWall = cell === 1;
                const isPlayer =
                  playerPos.row === rIdx && playerPos.col === cIdx;
                const isExit = rIdx === END_POS.row && cIdx === END_POS.col;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`relative flex items-center justify-center ${
                      isWall
                        ? "bg-slate-950"
                        : isExit
                          ? "bg-emerald-100/90 border border-emerald-300"
                          : "bg-slate-100 border-[0.5px] border-slate-200/50"
                    }`}
                  >
                    {isExit && !isPlayer && (
                      <span className="text-[9px] text-emerald-600 font-black animate-bounce">
                        ↓
                      </span>
                    )}

                    {isPlayer && (
                      <img
                        src={rostoImg}
                        alt="Brunna"
                        className="w-[85%] h-[85%] object-contain z-20 drop-shadow-md"
                      />
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        {/* SHOPPING DESTINO - COMPACTO */}
        <div className="flex items-center gap-2 mt-1 bg-white/80 px-3 py-1 rounded-xl border border-stone-200 shadow-sm shrink-0">
          <span className="text-[10px] text-stone-400 font-black">SAÍDA ↓</span>
          <img
            src={shoppingImg}
            alt="Shopping"
            className="w-7 h-7 object-contain drop-shadow"
          />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-black text-stone-800 uppercase">
              Shopping
            </span>
            <span className="text-[8px] font-bold text-emerald-600">
              Destino Final 🛍️
            </span>
          </div>
        </div>
      </div>

      {/* D-PAD VIRTUAL TOTALMENTE VISÍVEL */}
      <div className="grid grid-cols-3 gap-1.5 w-36 items-center justify-items-center mb-2 z-30 shrink-0">
        <div />
        <button
          onClick={() => movePlayer(-1, 0)}
          className="w-11 h-11 bg-white active:bg-stone-200 text-stone-700 rounded-xl shadow border border-stone-200 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Cima"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
        </button>
        <div />

        <button
          onClick={() => movePlayer(0, -1)}
          className="w-11 h-11 bg-white active:bg-stone-200 text-stone-700 rounded-xl shadow border border-stone-200 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Esquerda"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4 12l8-8v5h8v6h-8v5z" />
          </svg>
        </button>

        <div className="w-3 h-3 rounded-full bg-stone-300/40" />

        <button
          onClick={() => movePlayer(0, 1)}
          className="w-11 h-11 bg-white active:bg-stone-200 text-stone-700 rounded-xl shadow border border-stone-200 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Direita"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20 12l-8-8v5H4v6h8v5z" />
          </svg>
        </button>

        <div />
        <button
          onClick={() => movePlayer(1, 0)}
          className="w-11 h-11 bg-white active:bg-stone-200 text-stone-700 rounded-xl shadow border border-stone-200 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Baixo"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 20l8-8h-5V4h-6v8H4z" />
          </svg>
        </button>
        <div />
      </div>

      {/* MODAL DE INTRODUÇÃO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in zoom-in duration-300">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center border border-stone-100">
            <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner border border-stone-100">
              🛍️
            </div>

            <h2 className="text-lg font-black text-stone-900 mb-2 uppercase tracking-wide">
              Fuga para o Shopping
            </h2>

            <p className="text-stone-500 font-medium my-3 leading-relaxed text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100">
              Brunna, qualquer desculpa é motivo para ir ao shopping torrar
              limite! 😜
              <br />
              <br />
              Navegue pelo labirinto e leve sua personagem até a saída indicada.
            </p>

            <button
              onClick={startGame}
              className="w-full bg-stone-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-1"
            >
              Iniciar Desafio
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE VITÓRIA */}
      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center border border-stone-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-3 p-3 border border-stone-100">
              <img
                src={shoppingImg}
                alt="Shopping alcançado"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            <h2 className="text-xl font-black text-stone-900 mb-2 uppercase tracking-wide">
              Destino Alcançado!
            </h2>

            <div className="bg-stone-50 rounded-2xl p-3 mb-5 w-full border border-stone-100">
              <p className="text-stone-600 text-xs font-medium leading-relaxed">
                Superou o labirinto em{" "}
                <span className="font-black text-stone-900">
                  {moves} passos
                </span>{" "}
                e chegou a tempo das lojas abrirem. O limite do cartão que lute!
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={restartGame}
                className="w-full bg-stone-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Jogar Novamente
              </button>
              <button
                onClick={() => setGame("hub")}
                className="w-full bg-transparent text-stone-400 hover:text-stone-600 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors"
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
