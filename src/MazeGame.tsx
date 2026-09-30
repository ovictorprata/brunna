import { useState, useEffect, useCallback } from "react";

const SISTER_IMG_URL = "https://placehold.co/100x150/pink/white?text=Irma";
const MONSTER_IMG_URL = "https://placehold.co/40x40/red/white?text=Monstro";

interface Props {
  setGame: (game: string) => void;
}

export default function MazeGame({ setGame }: Props) {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [monsterPos, setMonsterPos] = useState({ x: 4, y: 4 });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const gridSize = 5;
  const goalPos = { x: 4, y: 0 };

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (gameOver || won) return;
      setPlayerPos((prev) => {
        const newX = Math.max(0, Math.min(gridSize - 1, prev.x + dx));
        const newY = Math.max(0, Math.min(gridSize - 1, prev.y + dy));

        // Verifica se o jogador pegou o troféu
        if (newX === goalPos.x && newY === goalPos.y) setWon(true);

        // CORREÇÃO AQUI: Verifica se o jogador andou para cima do monstro
        if (newX === monsterPos.x && newY === monsterPos.y) setGameOver(true);

        return { x: newX, y: newY };
      });
    },
    [gameOver, won, goalPos.x, goalPos.y, monsterPos.x, monsterPos.y],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    if (gameOver || won) return;
    const interval = setInterval(() => {
      setMonsterPos((prev) => {
        const dx = playerPos.x > prev.x ? 1 : playerPos.x < prev.x ? -1 : 0;
        const dy = playerPos.y > prev.y ? 1 : playerPos.y < prev.y ? -1 : 0;

        const moveX = Math.random() > 0.5 ? dx : 0;
        const moveY = moveX === 0 ? dy : 0;
        const newX = prev.x + moveX;
        const newY = prev.y + moveY;

        // O monstro também verifica se andou para cima do jogador
        if (newX === playerPos.x && newY === playerPos.y) setGameOver(true);
        return { x: newX, y: newY };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playerPos, gameOver, won]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-4">
      <button
        onClick={() => setGame("hub")}
        className="absolute top-4 left-4 bg-white p-2 rounded shadow"
      >
        Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4 text-purple-800">
        Fuja do Monstro!
      </h2>

      <div className="grid grid-cols-5 gap-1 bg-gray-300 p-2 rounded">
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isPlayer = x === playerPos.x && y === playerPos.y;
          const isMonster = x === monsterPos.x && y === monsterPos.y;
          const isGoal = x === goalPos.x && y === goalPos.y;

          return (
            <div
              key={i}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-white flex items-center justify-center text-2xl relative"
            >
              {isGoal && !isPlayer && "🏆"}
              {isPlayer && (
                <div
                  className="w-full h-full bg-cover bg-center rounded-full border-2 border-green-500"
                  style={{ backgroundImage: `url(${SISTER_IMG_URL})` }}
                />
              )}
              {isMonster && (
                <div
                  className="absolute w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${MONSTER_IMG_URL})` }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button
          onClick={() => movePlayer(0, -1)}
          className="bg-purple-500 text-white p-4 rounded text-xl"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => movePlayer(-1, 0)}
          className="bg-purple-500 text-white p-4 rounded text-xl"
        >
          ←
        </button>
        <button
          onClick={() => movePlayer(0, 1)}
          className="bg-purple-500 text-white p-4 rounded text-xl"
        >
          ↓
        </button>
        <button
          onClick={() => movePlayer(1, 0)}
          className="bg-purple-500 text-white p-4 rounded text-xl"
        >
          →
        </button>
      </div>

      {won && (
        <p className="mt-4 text-2xl font-bold text-green-600">
          Você escapou e pegou o troféu! 🎉
        </p>
      )}
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">
            O monstro te pegou!
          </p>
          <button
            onClick={() => {
              setPlayerPos({ x: 0, y: 0 });
              setMonsterPos({ x: 4, y: 4 });
              setGameOver(false);
              setWon(false);
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Tentar de novo
          </button>
        </div>
      )}
    </div>
  );
}
