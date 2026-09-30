import { useState, useEffect, useRef, useCallback } from "react";

// Imagens do jogo
import rostoImg from "./assets/maze_game/rosto.png";
import shoppingImg from "./assets/maze_game/shopping.png";

// Áudio
import victoriaSound from "./assets/jump_game/parabens.mp3";

interface Props {
  setGame: (game: string) => void;
}

// Grid do Labirinto Vertical Maior (11 colunas x 15 linhas)
// 1 = Parede / Obstáculo, 0 = Caminho Livre
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
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], // Saída na base (14, 7) -> Vai pro Shopping!
];

const START_POS = { row: 0, col: 1 };
const END_POS = { row: 14, col: 7 };

export default function MazeGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const parabensRef = useRef<HTMLAudioElement>(null);
  const playerPosRef = useRef(playerPos);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  // Movimentação do jogador
  const movePlayer = useCallback(
    (dRow: number, dCol: number) => {
      if (!hasStarted || gameWon) return;

      const newRow = playerPosRef.current.row + dRow;
      const newCol = playerPosRef.current.col + dCol;

      // Limites do grid
      if (
        newRow < 0 ||
        newRow >= MAZE_GRID.length ||
        newCol < 0 ||
        newCol >= MAZE_GRID[0].length
      ) {
        return;
      }

      // Colisão com paredes
      if (MAZE_GRID[newRow][newCol] === 1) {
        return;
      }

      setPlayerPos({ row: newRow, col: newCol });
      setMoves((prev) => prev + 1);

      // Chegou na saída
      if (newRow === END_POS.row && newCol === END_POS.col) {
        setGameWon(true);
        if (parabensRef.current) {
          parabensRef.current.currentTime = 0;
          parabensRef.current.play().catch(() => {});
        }
      }
    },
    [hasStarted, gameWon],
  );

  // Suporte a teclado
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

  // Confetes ao vencer
  useEffect(() => {
    if (gameWon) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        // @ts-expect-error
        window.confetti({
          particleCount: 300,
          spread: 140,
          origin: { y: 0.3 },
          zIndex: 9999,
        });
      };
      document.body.appendChild(script);
    }
  }, [gameWon]);

  const restartGame = () => {
    setPlayerPos(START_POS);
    setGameWon(false);
    setMoves(0);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-fuchsia-100 select-none touch-none font-sans flex flex-col items-center justify-between p-3">
      <audio ref={parabensRef} src={victoriaSound} />

      {/* Topo / Header */}
      <div className="w-full max-w-md flex items-center justify-between z-30 pt-1">
        <button
          onClick={() => setGame("hub")}
          className="px-4 py-1.5 bg-white text-fuchsia-700 font-bold rounded-full shadow-md border border-fuchsia-200 active:scale-95 transition-all text-xs"
        >
          ← Voltar
        </button>

        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-xs font-black text-fuchsia-900 border border-fuchsia-200">
          Passos: <span className="text-fuchsia-600">{moves}</span>
        </div>
      </div>

      {/* Título */}
      <div className="text-center my-1 z-20">
        <h1 className="text-xl md:text-2xl font-black text-fuchsia-900 uppercase tracking-wide">
          A Cobreola do Shopping 🛍️
        </h1>
      </div>

      {/* ÁREA DO LABIRINTO COM SHOPPING EXTERNO */}
      <div className="relative w-full max-w-[360px] flex-1 flex flex-col items-center justify-center my-auto">
        {/* O Grid do Labirinto */}
        <div className="w-full bg-slate-900 p-2 rounded-t-2xl shadow-2xl border-4 border-b-0 border-fuchsia-500">
          <div
            className="grid w-full gap-0 rounded-lg overflow-hidden border border-slate-700"
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

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`aspect-square relative flex items-center justify-center ${
                      isWall
                        ? "bg-slate-900"
                        : "bg-fuchsia-50/90 border-[0.5px] border-fuchsia-200/40"
                    }`}
                  >
                    {/* Jogador */}
                    {isPlayer && (
                      <img
                        src={rostoImg}
                        alt="Brunna"
                        className="w-[95%] h-[95%] object-contain z-20 transition-all duration-100 drop-shadow-md"
                      />
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        {/* Destino Final Externo: O SHOPPING */}
        <div className="w-full bg-gradient-to-b from-fuchsia-600 to-purple-700 py-2 px-4 rounded-b-2xl border-4 border-t-0 border-fuchsia-500 shadow-xl flex items-center justify-between">
          <span className="text-white text-xs font-black uppercase tracking-wider">
            Saindo do labirinto...
          </span>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm border border-white/30">
            <span className="text-xs font-black text-white">SHOPPING</span>
            <img
              src={shoppingImg}
              alt="Shopping"
              className="w-10 h-10 object-contain drop-shadow-lg animate-bounce"
            />
          </div>
        </div>
      </div>

      {/* D-PAD VIRTUAL PARA MOBILE */}
      <div className="w-full max-w-[240px] flex flex-col items-center gap-1 my-1 z-30 pb-safe">
        <button
          onClick={() => movePlayer(-1, 0)}
          className="w-14 h-12 bg-fuchsia-600 active:bg-fuchsia-800 text-white font-black text-xl rounded-xl shadow-[0_3px_0_0_rgba(162,28,175,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
        >
          ▲
        </button>

        <div className="flex justify-between w-full px-2">
          <button
            onClick={() => movePlayer(0, -1)}
            className="w-14 h-12 bg-fuchsia-600 active:bg-fuchsia-800 text-white font-black text-xl rounded-xl shadow-[0_3px_0_0_rgba(162,28,175,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
          >
            ◀
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="w-14 h-12 bg-fuchsia-600 active:bg-fuchsia-800 text-white font-black text-xl rounded-xl shadow-[0_3px_0_0_rgba(162,28,175,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
          >
            ▶
          </button>
        </div>

        <button
          onClick={() => movePlayer(1, 0)}
          className="w-14 h-12 bg-fuchsia-600 active:bg-fuchsia-800 text-white font-black text-xl rounded-xl shadow-[0_3px_0_0_rgba(162,28,175,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
        >
          ▼
        </button>
      </div>

      {/* MODAL DE INTRODUÇÃO (HUMOR/ZUEIRA VICTOR & BRUNNA) */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in zoom-in">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl text-center border-4 border-fuchsia-400 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-2 text-4xl shadow-inner border border-fuchsia-200">
              💳
            </div>

            <h2 className="text-2xl font-black text-fuchsia-700 mb-2 uppercase">
              Missão: Falir o Cartão! 🛍️
            </h2>

            <p className="text-gray-700 font-medium my-3 leading-relaxed text-sm bg-fuchsia-50 p-4 rounded-xl border border-fuchsia-100">
              Brunna, nós sabemos que se deixar, você mora dentro do shopping!
              <br />
              <br />
              Eu (Victor, seu irmão favorito 😜) preparei este labirinto
              especialmente para você encontrar o caminho até o seu lugar
              sagrado de torrar dinheiro.
            </p>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4 text-xs text-gray-600 font-bold">
              💡 Use os botões roxos abaixo para guiar sua cabeça até a saída no
              Shopping!
            </div>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-3.5 rounded-2xl font-black text-lg shadow-[0_5px_0_0_rgba(162,28,175,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Bora Gastar! 💳
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE VITÓRIA */}
      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl text-center border-4 border-fuchsia-500">
            <div className="w-20 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-3 text-5xl shadow-inner border border-fuchsia-200">
              🛍️
            </div>

            <h2 className="text-2xl font-black text-fuchsia-700 mb-2 uppercase">
              SHOPPING ALCANÇADO!
            </h2>

            <p className="text-gray-700 font-bold mb-5 text-sm bg-fuchsia-50 p-4 rounded-xl border border-fuchsia-100">
              Parabéns, Brunna! Você driblou todas as barreiras e completou o
              labirinto em{" "}
              <span className="text-fuchsia-700">{moves} passos</span>.
              <br />
              <br />
              <span className="text-fuchsia-800 italic">
                O limite do cartão que lute hoje! Ass: Victor.
              </span>
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={restartGame}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-3 rounded-2xl font-black text-base shadow-[0_4px_0_0_rgba(162,28,175,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                Gastar Mais Um Pouco (Repetir) 🔄
              </button>
              <button
                onClick={() => setGame("hub")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-2xl font-bold text-sm transition-all"
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
