import { useState } from "react";
import Board from "./Board";

function random(n) {
  return Math.ceil(Math.random() * n);
}

function App() {
  const [gameHistory, setGameHistory] = useState([]);
  const [otherGameHistory, setOtherGameHistory] = useState([]);

  const handleRollClick = () => {
    const nextMyNum = random(6);
    const nextOtherNum = random(6);

    setGameHistory([...gameHistory, nextMyNum]);
    setOtherGameHistory([...otherGameHistory, nextOtherNum]);
  };

  const handleClearClick = () => {
    setGameHistory([]);
    setOtherGameHistory([]);
  };
  return (
    <div>
      <Board name="나" color="blue" gameHistory={gameHistory} />
      <Board name="상대" color="red" gameHistory={otherGameHistory} />
    </div>
  );
}

export default App;
