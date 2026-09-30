import { useState, useEffect, useRef } from "react";

// Importando os 4 estágios da Dara
import dara1 from "./assets/jump_game/nivel_1.png";
import dara1Comendo from "./assets/jump_game/nivel_1_comendo.png";
import dara2 from "./assets/jump_game/nivel_2.png";
import dara2Comendo from "./assets/jump_game/nivel_2_comendo.png";
import dara3 from "./assets/jump_game/nivel_3.png";
import dara3Comendo from "./assets/jump_game/nivel_3_comendo.png";
import dara4 from "./assets/jump_game/nivel_4.png";
import dara4Comendo from "./assets/jump_game/nivel_4_comendo.png";

// Importando as comidas
import cenoura from "./assets/jump_game/cenoura.png";
import batata from "./assets/jump_game/batata.png";
import racao from "./assets/jump_game/racao.png";
import comida from "./assets/jump_game/comida.png";
import carne from "./assets/jump_game/carne.png";
import bife from "./assets/jump_game/bife.png";
import arroz from "./assets/jump_game/arroz.png";
import frango from "./assets/jump_game/frango.png";
import peixe from "./assets/jump_game/peixe.png";
import melancia from "./assets/jump_game/melancia.png";
import banana from "./assets/jump_game/banana.png";

// Importando áudios
import bgMusic from "./assets/jump_game/dara.mp3";
import chewSound from "./assets/jump_game/mastigando.mp3";

interface Props {
  setGame: (game: string) => void;
}

const FOOD_DB = [
  { id: "cenoura", src: cenoura },
  { id: "batata", src: batata },
  { id: "racao", src: racao },
  { id: "comida", src: comida },
  { id: "carne", src: carne },
  { id: "bife", src: bife },
  { id: "arroz", src: arroz },
  { id: "frango", src: frango },
  { id: "peixe", src: peixe },
  { id: "melancia", src: melancia },
  { id: "banana", src: banana },
];

const getRandomOptions = () => {
  const shuffled = [...FOOD_DB].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
};

export default function DaraGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [daraLevel, setDaraLevel] = useState(1);

  // Controles de animação rápida de mastigação
  const [isChewing, setIsChewing] = useState(false);
  const [chewFrame, setChewFrame] = useState(false);

  const [options, setOptions] = useState(() => getRandomOptions());
  const [flyingFood, setFlyingFood] = useState<{
    src: string;
    fromLeft: boolean;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const chewAudioRef = useRef<HTMLAudioElement>(null);

  // Motor de mastigação rápida
  useEffect(() => {
    if (!isChewing) return;

    const interval = window.setInterval(() => {
      setChewFrame((prev) => !prev);
    }, 150);

    return () => window.clearInterval(interval);
  }, [isChewing]);

  const handleFeed = (foodSrc: string, fromLeft: boolean) => {
    if (isProcessing || gameOver) return;
    setIsProcessing(true);

    if (chewAudioRef.current) {
      chewAudioRef.current.currentTime = 0;
      chewAudioRef.current.play().catch(() => {});
    }

    setFlyingFood({ src: foodSrc, fromLeft });

    setTimeout(() => {
      setFlyingFood(null);
      setIsChewing(true);

      setTimeout(() => {
        setIsChewing(false);

        if (daraLevel < 4) {
          setDaraLevel((prev) => prev + 1);
          setOptions(getRandomOptions());
          setIsProcessing(false);
        } else {
          setGameOver(true);
        }
      }, 1200);
    }, 500);
  };

  const startGame = () => {
    setHasStarted(true);
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.3;
      bgAudioRef.current.play().catch(() => {});
    }
  };

  const restartGame = () => {
    setDaraLevel(1);
    setIsChewing(false);
    setGameOver(false);
    setIsProcessing(false);
    setOptions(getRandomOptions());
  };

  let currentDaraImage = dara1;
  if (daraLevel === 1)
    currentDaraImage = isChewing && chewFrame ? dara1Comendo : dara1;
  if (daraLevel === 2)
    currentDaraImage = isChewing && chewFrame ? dara2Comendo : dara2;
  if (daraLevel === 3)
    currentDaraImage = isChewing && chewFrame ? dara3Comendo : dara3;
  if (daraLevel === 4)
    currentDaraImage = isChewing && chewFrame ? dara4Comendo : dara4;

  return (
    // Fundo vibrante e moderno
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-br from-rose-200 via-orange-100 to-amber-200 flex flex-col font-sans select-none touch-none text-stone-900">
      <audio ref={bgAudioRef} src={bgMusic} loop />
      <audio ref={chewAudioRef} src={chewSound} />

      <style>{`
        /* Animação ajustada para ir exatamente até o rosto da Dara e diminuir simulando profundidade */
        @keyframes arcLeft {
          0% { left: 20%; bottom: 8vh; transform: translate(-50%, 0) scale(1) rotate(0deg); opacity: 1; }
          50% { left: 35%; bottom: 42vh; transform: translate(-50%, 0) scale(1.2) rotate(180deg); opacity: 1; }
          100% { left: 50%; bottom: 30vh; transform: translate(-50%, 0) scale(0.2) rotate(360deg); opacity: 0; }
        }
        @keyframes arcRight {
          0% { left: 80%; bottom: 8vh; transform: translate(-50%, 0) scale(1) rotate(0deg); opacity: 1; }
          50% { left: 65%; bottom: 42vh; transform: translate(-50%, 0) scale(1.2) rotate(-180deg); opacity: 1; }
          100% { left: 50%; bottom: 30vh; transform: translate(-50%, 0) scale(0.2) rotate(-360deg); opacity: 0; }
        }
        .anim-throw-left { animation: arcLeft 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .anim-throw-right { animation: arcRight 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>

      {/* HEADER MINIMALISTA */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <button
          onClick={() => setGame("hub")}
          className="text-orange-600 hover:text-orange-800 font-black text-xs uppercase tracking-widest transition-colors bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          ◄ Sair
        </button>

        {hasStarted && !gameOver && (
          <div className="flex gap-2 bg-white/40 px-4 py-2 rounded-full backdrop-blur-sm">
            {[1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${daraLevel >= lvl ? "bg-orange-500 shadow-sm" : "bg-orange-200"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CHÃO CURVADO E COLORIDO */}
      <div className="absolute bottom-0 w-full h-[22vh] bg-gradient-to-t from-emerald-500 to-emerald-400 z-10 rounded-t-[40%] scale-110 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]"></div>

      {/* ANIMAÇÃO DA COMIDA (Z-20: Atrás da Dara) */}
      {flyingFood && (
        <div
          className={`absolute z-20 w-20 h-20 ${flyingFood.fromLeft ? "anim-throw-left" : "anim-throw-right"}`}
        >
          <img
            src={flyingFood.src}
            alt="Comida"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      )}

      {/* A DARA (Z-30: Na frente da comida, ancorada na base) */}
      <div className="absolute bottom-[20vh] left-1/2 -translate-x-1/2 flex flex-col items-center justify-end z-30 w-full max-w-sm">
        <img
          src={currentDaraImage}
          alt="Dara"
          className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] transition-transform duration-300"
          style={{
            height: "42vh",
            maxWidth: "100%",
            transformOrigin: "bottom center",
          }}
        />

        {/* Feedback visual mastigando */}
        <div
          className={`absolute -top-4 text-orange-600 font-black text-sm tracking-widest uppercase transition-opacity duration-300 bg-white/80 px-4 py-1 rounded-full shadow-lg backdrop-blur-sm ${isChewing ? "opacity-100 -translate-y-4" : "opacity-0 translate-y-0"}`}
        >
          Nham...
        </div>
      </div>

      {/* OPÇÕES DE COMIDA (Z-40) */}
      <div className="absolute bottom-[4vh] w-full flex justify-between px-[15%] md:px-[30%] z-40">
        {options.map((opt, index) => (
          <button
            key={opt.id + index}
            disabled={isProcessing || !hasStarted}
            onClick={() => handleFeed(opt.src, index === 0)}
            className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center active:scale-75 transition-transform disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {/* Sombra da comida */}
            <div className="absolute -bottom-2 w-14 h-4 bg-emerald-700/40 rounded-full blur-md group-hover:bg-emerald-700/60 transition-colors"></div>
            <img
              src={opt.src}
              alt="Opção de Comida"
              className="relative w-full h-full object-contain drop-shadow-2xl group-hover:-translate-y-3 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* MODAL DE INTRODUÇÃO */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-md p-5 animate-in zoom-in duration-500">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] text-center border-4 border-orange-100">
            <h2 className="text-2xl font-black text-orange-500 mb-2 uppercase tracking-widest">
              A Dieta da Dara
            </h2>
            <p className="text-stone-600 font-medium my-6 leading-relaxed text-sm">
              Sua missão é clara: alimentar a Dara com opções saudáveis para que
              ela finalmente consiga emagrecer.
              <br />
              <br />
              Pense bem antes de agir. O resultado depende apenas das suas
              escolhas.
            </p>
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4"
            >
              Iniciar Dieta
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE GAME OVER */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-5 animate-in fade-in delay-700">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] text-center relative overflow-hidden flex flex-col items-center">
            {/* Imagem circular GIGANTE */}
            <div className="mb-6 relative z-10">
              <div className="w-48 h-48 md:w-56 md:h-56 bg-orange-50 rounded-full flex items-center justify-center p-2 shadow-[0_0_30px_rgba(0,0,0,0.06)] border border-orange-100">
                <img
                  src={dara4}
                  alt="Dara Gordinha"
                  className="w-full h-full object-contain scale-110 drop-shadow-md"
                />
              </div>
            </div>

            <h2 className="text-2xl font-black text-stone-900 mb-6 uppercase tracking-widest">
              A Ilusão da Escolha
            </h2>

            <div className="bg-stone-50 rounded-2xl p-5 mb-8 w-full border border-stone-100">
              <p className="text-stone-600 font-medium text-sm leading-relaxed">
                Não adianta. Você pode dar melancia, batata doce ou vento... A
                Dara tem a habilidade genética de converter absolutamente TUDO
                em puro carboidrato!
              </p>
              <p className="text-rose-500 italic text-xs mt-4 font-black">
                "Desista, humana! Eu nasci pra ser redondinha e fofa!"
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={restartGame}
                className="w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                Aceitar a Derrota
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
