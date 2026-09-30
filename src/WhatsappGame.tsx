import { useState, useEffect, useRef } from "react";
import rostoImg from "./assets/maze_game/rosto.png";

interface Props {
  setGame: (game: string) => void;
}

type Message = {
  id: number;
  text: string;
  sender: "me" | "brunna";
  time: string;
};

// Mensagens apenas do Marcos (tentando puxar assunto sem sucesso ainda)
const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Bom diaaa!", sender: "me", time: "10:00" },
  {
    id: 2,
    text: "Vi que você curtiu meu story hein 👀",
    sender: "me",
    time: "14:30",
  },
];

export default function WhatsappGame({ setGame }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, hasStarted]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  // Envio de mensagem
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "me",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // O charme do "digitando..."
    setTimeout(() => {
      const newBrunnaMsg: Message = {
        id: Date.now() + 1,
        text: "mas...quais são as suas intenções comigo?",
        sender: "brunna",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, newBrunnaMsg]);
      setIsTyping(false);
    }, 1800); // 1.8 segundos de tensão
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#efeae2] flex flex-col font-sans select-none">
      {/* PADRÃO DE FUNDO DO WHATSAPP */}
      <div
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* HEADER TIPO WHATSAPP */}
      <div className="bg-[#008069] text-white flex items-center px-2 py-3 z-20 shadow-md">
        <button
          onClick={() => setGame("hub")}
          className="flex items-center p-1 rounded-full active:bg-white/20 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center ml-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border border-white/30 mr-3">
            <img
              src={rostoImg}
              alt="Brunna"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight tracking-wide">
              Brunna
            </span>
            <span className="text-xs text-white/80 font-medium">
              {isTyping ? "digitando..." : "visto por último hoje às 14:35"}
            </span>
          </div>
        </div>
      </div>

      {/* ÁREA DO CHAT */}
      <div className="flex-1 overflow-y-auto p-4 z-10 flex flex-col gap-3 pb-4 scroll-smooth">
        <div className="flex justify-center mb-2">
          <div className="bg-[#ffeecd] text-[#544336] text-[11px] font-medium px-4 py-1.5 rounded-lg text-center max-w-[90%] shadow-sm leading-tight">
            As mensagens e as chamadas são protegidas com a criptografia de
            ponta a ponta. Ninguém fora desta conversa pode lê-las ou ouvi-las.
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-white/80 text-gray-500 text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
            HOJE
          </div>
        </div>

        {/* LISTAGEM DAS MENSAGENS */}
        {messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[85%] px-3 py-2 rounded-lg shadow-sm text-[15px] leading-snug flex flex-col ${
                  isMe
                    ? "bg-[#dcf8c6] rounded-tr-none text-gray-800"
                    : "bg-white rounded-tl-none text-gray-800"
                }`}
              >
                <div
                  className={`absolute top-0 w-3 h-3 ${isMe ? "-right-2 bg-[#dcf8c6]" : "-left-2 bg-white"}`}
                  style={{
                    clipPath: isMe
                      ? "polygon(0 0, 0 100%, 100% 0)"
                      : "polygon(100% 0, 100% 100%, 0 0)",
                  }}
                ></div>

                <span className="pb-3 pr-2 break-words">{msg.text}</span>

                <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-gray-500/80 font-medium">
                  {msg.time}
                  {isMe && (
                    <svg
                      viewBox="0 0 18 18"
                      width="14"
                      height="14"
                      className="fill-blue-500"
                    >
                      <path d="M17.394 5.075l-8.498 8.498a1 1 0 01-1.414 0l-3.322-3.322a1 1 0 111.414-1.414l2.615 2.615 7.791-7.791a1 1 0 111.414 1.414z" />
                      <path d="M12.394 5.075l-4.498 4.498a1 1 0 01-1.414 0l-1.322-1.322a1 1 0 111.414-1.414l.615.615 3.791-3.791a1 1 0 111.414 1.414z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="relative max-w-[85%] px-4 py-3 bg-white rounded-lg rounded-tl-none shadow-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1 w-full shrink-0" />
      </div>

      {/* BARRA DE DIGITAÇÃO */}
      <div className="bg-[#f0f2f5] p-2 flex items-end gap-2 z-20 pb-safe">
        <form
          onSubmit={handleSendMessage}
          className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 md:py-2.5 shadow-sm overflow-hidden min-h-[44px]"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Mensagem"
            className="w-full bg-transparent outline-none text-[15px] placeholder-gray-500 py-1"
            disabled={isTyping || !hasStarted}
            autoComplete="off"
          />
        </form>

        {inputValue.trim() ? (
          <button
            onClick={handleSendMessage}
            className="w-11 h-11 shrink-0 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm active:scale-90 transition-transform"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        ) : (
          <div className="w-11 h-11 shrink-0 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm opacity-50 cursor-not-allowed">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.468 2.349 8.468 4.35v7.061c0 2.001 1.53 3.531 3.531 3.531zM17.29 11.411c0 2.93-2.378 5.291-5.291 5.291s-5.291-2.361-5.291-5.291H4.664c0 3.705 2.779 6.786 6.335 7.288v3.19h2.001v-3.19c3.555-.502 6.334-3.583 6.334-7.288h-2.044z" />
            </svg>
          </div>
        )}
      </div>

      {/* MODAL DE INTRODUÇÃO (A História e o Contexto) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in zoom-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center border-b-8 border-[#008069]">
            <div className="w-16 h-16 bg-[#dcf8c6] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#00a884]">
              <span className="text-3xl">🕵️‍♂️</span>
            </div>

            <h2 className="text-2xl font-black text-[#008069] mb-4 uppercase tracking-tight leading-none">
              A Defesa Implacável
            </h2>

            <p className="text-gray-600 font-medium my-4 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
              Volte no tempo! Vocês ainda não estão juntos. Neste jogo,{" "}
              <span className="font-bold text-[#008069]">VOCÊ É O MARCOS</span>{" "}
              (o futuro marido), tentando conquistar a Brunna com o papo lá no
              começo de tudo.
              <br />
              <br />
              Será que você consegue mandar a mensagem ideal que irá
              conquistá-la?
            </p>

            <button
              onClick={() => setHasStarted(true)}
              className="w-full bg-[#008069] hover:bg-[#075e54] text-white py-4 mt-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Assumir o celular do Marcos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
