import { useState } from "react";
import Hub from "./Hub";
import JumpGame from "./JumpGame";
import MazeGame from "./MazeGame";
import CopaGame from "./CopaGame";
import BabyGame from "./BabyGame";
import QuizGame from "./QuizGame";
import FishGame from "./FishGame";
import WhatsappGame from "./WhatsappGame";
import DaraGame from "./DaraGame";

export default function App() {
  const [currentGame, setCurrentGame] = useState<string>("hub");

  return (
    <>
      {currentGame === "hub" && <Hub setGame={setCurrentGame} />}
      {currentGame === "jump" && <JumpGame setGame={setCurrentGame} />}
      {currentGame === "maze" && <MazeGame setGame={setCurrentGame} />}
      {currentGame === "copa" && <CopaGame setGame={setCurrentGame} />}
      {currentGame === "bebe" && <BabyGame setGame={setCurrentGame} />}
      {currentGame === "quiz" && <QuizGame setGame={setCurrentGame} />}
      {currentGame === "peixe" && <FishGame setGame={setCurrentGame} />}
      {currentGame === "whatsapp" && <WhatsappGame setGame={setCurrentGame} />}
      {currentGame === "dara" && <DaraGame setGame={setCurrentGame} />}
    </>
  );
}
