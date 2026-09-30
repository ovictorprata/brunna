const NOME_IRMA = "Sua Irmã";

interface Props {
  setGame: (game: string) => void;
}

export default function Hub({ setGame }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 p-4 font-sans text-center">
      <h1 className="text-4xl font-bold text-pink-600 mb-6">
        Feliz Aniversário, {NOME_IRMA}! 🎉
      </h1>
      <p className="mb-8 text-lg text-gray-700">
        Escolha um mini-jogo para começar a festa:
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => setGame("jump")}
          className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-xl font-bold shadow-md transition transform hover:scale-105"
        >
          🏃‍♀️ Pula Corda
        </button>
        <button
          onClick={() => setGame("maze")}
          className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-xl font-bold shadow-md transition transform hover:scale-105"
        >
          👻 Fuga do Labirinto
        </button>
        <button
          onClick={() => setGame("clean")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-bold shadow-md transition transform hover:scale-105"
        >
          🧽 Limpeza Surpresa
        </button>
        <button
          onClick={() => setGame("copa")}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-bold shadow-md transition transform hover:scale-105"
        >
          🏆 Copa do Mundo
        </button>
        <button
          onClick={() => setGame("baby")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-xl font-bold shadow-md transition transform hover:scale-105"
        >
          👶 Jogo do Bebê
        </button>
        <button
          onClick={() => setGame("quiz")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-xl font-bold shadow-md transition transform hover:scale-105"
        >
          ? Quiz
        </button>
      </div>
    </div>
  );
}
