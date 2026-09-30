import { useState } from "react";
import Hub from "./Hub";
import JumpGame from "./JumpGame";
import MazeGame from "./MazeGame";
import CleanGame from "./CleanGame";
import CopaGame from "./CopaGame";
import BabyGame from "./BabyGame";
import QuizGame from "./QuizGame";

export default function App() {
  const [currentGame, setCurrentGame] = useState<string>("hub");

  return (
    <>
      {currentGame === "hub" && <Hub setGame={setCurrentGame} />}
      {currentGame === "jump" && <JumpGame setGame={setCurrentGame} />}
      {currentGame === "maze" && <MazeGame setGame={setCurrentGame} />}
      {currentGame === "clean" && <CleanGame setGame={setCurrentGame} />}
      {currentGame === "copa" && <CopaGame setGame={setCurrentGame} />}
      {currentGame === "baby" && <BabyGame setGame={setCurrentGame} />}
      {currentGame === "quiz" && <QuizGame setGame={setCurrentGame} />}
    </>
  );
}
