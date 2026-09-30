import { useState, useEffect, useRef } from "react";

const SISTER_CLEAN_IMG_URL =
  "https://placehold.co/400x400/pink/white?text=Foto+Revelada";

interface Props {
  setGame: (game: string) => void;
}

export default function CleanGame({ setGame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40;
    ctx.globalCompositeOperation = "destination-out";
  }, []);

  const erase = (e: any) => {
    if (!isDrawing || cleaned) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    checkCleanPercentage();
  };

  const checkCleanPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const totalPixels = pixels.length / 4;
    if (transparentPixels / totalPixels > 0.6) {
      setCleaned(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4 touch-none">
      <button
        onClick={() => setGame("hub")}
        className="absolute top-4 left-4 bg-white p-2 rounded shadow z-10"
      >
        Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Esfregue para limpar a foto!
      </h2>

      <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SISTER_CLEAN_IMG_URL})` }}
        />
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute inset-0 cursor-pointer"
          onMouseDown={(e) => {
            setIsDrawing(true);
            erase(e);
          }}
          onMouseMove={erase}
          onMouseUp={() => {
            setIsDrawing(false);
            canvasRef.current?.getContext("2d")?.beginPath();
          }}
          onMouseLeave={() => {
            setIsDrawing(false);
            canvasRef.current?.getContext("2d")?.beginPath();
          }}
          onTouchStart={(e) => {
            setIsDrawing(true);
            erase(e);
          }}
          onTouchMove={erase}
          onTouchEnd={() => {
            setIsDrawing(false);
            canvasRef.current?.getContext("2d")?.beginPath();
          }}
        />
      </div>

      {cleaned && (
        <div className="mt-8 animate-bounce text-center">
          <p className="text-3xl font-bold text-pink-500 drop-shadow-md">
            Surpresa revelada!! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
