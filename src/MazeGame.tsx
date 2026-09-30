import { useState, useEffect, useRef, useCallback } from "react";

// Imagens do labirinto
import rostoImg from "./assets/maze_game/rosto.png";
import shoppingImg from "./assets/maze_game/shopping.png";

// Áudios (opcionais, ajuste se tiver os arquivos no seu projeto)
import victoriaSound from "./assets/jump_game/parabens.mp3";

interface Props {
  setGame: (game: string) => void;
}

// Matriz do labirinto idêntico à imagem (1 = Parede, 0 = Caminho livre, 2 = Início, 3 = Chegada/Shopping)
// Grid 9x9 adaptado para o formato da imagem
const MAZE_GRID = [
  [1, 0, 1, 1, 1, 1, 1, 1, 1], // Entrada no topo (coluna 1)
  [1, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1], // Saída na base (coluna 7 - Shopping)
];

const START_POS = { row: 0, col: 1 };
const END_POS = { row: 8, col: 7 };

export default function MazeGame({ setGame }: Props) {
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const parabensRef = useRef<HTMLAudioElement>(null);

  // Referência do player para capturar posições em handlers assíncronos
  const playerPosRef = useRef(playerPos);
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  // Tenta mover o jogador para a nova posição
  const movePlayer = useCallback(
    (dRow: number, dCol: number) => {
      if (gameWon) return;

      const newRow = playerPosRef.current.row + dRow;
      const newCol = playerPosRef.current.col + dCol;

      // Verifica limites do grid
      if (
        newRow < 0 ||
        newRow >= MAZE_GRID.length ||
        newCol < 0 ||
        newCol >= MAZE_GRID[0].length
      ) {
        return;
      }

      // Verifica colisão com parede
      if (MAZE_GRID[newRow][newCol] === 1) {
        return;
      }

      // Atualiza posição
      setPlayerPos({ row: newRow, col: newCol });
      setMoves((prev) => prev + 1);

      // Verifica vitória
      if (newRow === END_POS.row && newCol === END_POS.col) {
        setGameWon(true);
        if (parabensRef.current) {
          parabensRef.current.currentTime = 0;
          parabensRef.current.play().catch(() => {});
        }
      }
    },
    [gameWon],
  );

  // Suporte para teclado (Setas e WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          movePlayer(-1, 0);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          movePlayer(1, 0);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          movePlayer(0, -1);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          movePlayer(0, 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  // Efeito Confetes na vitória
  useEffect(() => {
    if (gameWon) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        // @ts-expect-error
        window.confetti({
          particleCount: 250,
          spread: 120,
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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-purple-100 select-none touch-none font-sans flex flex-col items-center justify-between p-4">
      <audio ref={parabensRef} src={victoriaSound} />

      {/* Topo / Header */}
      <div className="w-full flex items-center justify-between z-30 pt-2">
        <button
          onClick={() => setGame("hub")}
          className="px-5 py-2 bg-white text-purple-700 font-bold rounded-full shadow-md border-2 border-purple-200 active:scale-95 transition-all text-sm"
        >
          ← Voltar
        </button>

        <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm text-xs font-black text-purple-900 border border-purple-200">
          Passos: <span className="text-purple-600">{moves}</span>
        </div>
      </div>

      {/* Título do Jogo */}
      <div className="text-center my-1 z-20">
        <h1 className="text-2xl md:text-3xl font-black text-purple-800 uppercase tracking-wide">
          Partiu Shopping! 🛍️
        </h1>
        <p className="text-xs text-purple-600 font-semibold">
          Guie a Brunna pelo labirinto até o shopping!
        </p>
      </div>

      {/* O LABIRINTO (Mobile First) */}
      <div className="relative w-full max-w-[340px] aspect-square bg-white p-3 rounded-2xl shadow-xl border-4 border-purple-400 flex items-center justify-center my-auto">
        <div className="grid grid-cols-9 grid-rows-9 w-full h-full gap-0.5 relative bg-purple-50 rounded-lg p-1 border border-purple-200">
          {MAZE_GRID.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isWall = cell === 1;
              const isPlayer = playerPos.row === rIdx && playerPos.col === cIdx;
              const isShopping = END_POS.row === rIdx && END_POS.col === cIdx;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`relative flex items-center justify-center rounded-sm transition-colors duration-100 ${
                    isWall ? "bg-slate-900 border border-slate-800" : "bg-white"
                  }`}
                >
                  {/* Posição Final - Shopping */}
                  {isShopping && (
                    <img
                      src={shoppingImg}
                      alt="Shopping"
                      className="w-[85%] h-[85%] object-contain animate-bounce z-10"
                    />
                  )}

                  {/* Posição do Jogador - Rosto */}
                  {isPlayer && (
                    <img
                      src={rostoImg}
                      alt="Rosto"
                      className="w-[90%] h-[90%] object-contain z-20 transition-all duration-150 drop-shadow-md"
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* CONTROLES MOBILE (D-Pad Virtual) */}
      <div className="w-full max-w-[280px] flex flex-col items-center gap-1 my-2 z-30 pb-safe">
        {/* Botão Cima */}
        <button
          onClick={() => movePlayer(-1, 0)}
          className="w-16 h-14 bg-purple-600 active:bg-purple-800 text-white font-black text-2xl rounded-2xl shadow-[0_4px_0_0_rgba(107,33,168,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
        >
          ▲
        </button>

        {/* Botões Esquerda / Direita */}
        <div className="flex justify-between w-full px-4">
          <button
            onClick={() => movePlayer(0, -1)}
            className="w-16 h-14 bg-purple-600 active:bg-purple-800 text-white font-black text-2xl rounded-2xl shadow-[0_4px_0_0_rgba(107,33,168,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
          >
            ◀
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="w-16 h-14 bg-purple-600 active:bg-purple-800 text-white font-black text-2xl rounded-2xl shadow-[0_4px_0_0_rgba(107,33,168,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
          >
            ▶
          </button>
        </div>

        {/* Botão Baixo */}
        <button
          onClick={() => movePlayer(1, 0)}
          className="w-16 h-14 bg-purple-600 active:bg-purple-800 text-white font-black text-2xl rounded-2xl shadow-[0_4px_0_0_rgba(107,33,168,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
        >
          ▼
        </button>
      </div>

      {/* MODAL DE VITÓRIA */}
      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl text-center border-4 border-purple-500">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl shadow-inner border border-purple-200">
              🛍️
            </div>

            <h2 className="text-3xl font-black text-purple-700 mb-2 uppercase">
              CHEGOU NO SHOPPING!
            </h2>

            <p className="text-gray-700 font-bold mb-6 text-sm bg-purple-50 p-4 rounded-xl border border-purple-100">
              Você completou o labirinto em{" "}
              <span className="text-purple-700">{moves} passos</span>!
              <br />
              <br />
              Hora de fazer umas comprinhas! 💳✨
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={restartGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-2xl font-black text-lg shadow-[0_5px_0_0_rgba(107,33,168,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                Jogar Novamente 🔄
              </button>
              <button
                onClick={() => setGame("hub")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-base transition-all"
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
