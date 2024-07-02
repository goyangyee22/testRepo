import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import Board from "./Board";

function random(n) {
  return Math.ceil(Math.random() * n);
}

function App() {
  const [gameHistory, setGameHistory] = useState([]);
  const [otherGameHistory, setOtherGameHistory] = useState([]);
  console.log(gameHistory);
  console.log(otherGameHistory);

  const handleRollClick = () => {
    // 주사위 숫자를 뽑음
    const nextMyNum = random(6);
    const nextOtherNum = random(6);

    // 기록 추가
    setGameHistory([...gameHistory, nextMyNum]);
    setOtherGameHistory([...otherGameHistory, nextOtherNum]);
  };

  const handleClearClick = () => {
    setGameHistory([]);
    setOtherGameHistory([]);
  };

  return (
    <div className="App">
      <div>
        <img src={logo} className="App-logo" />
        <h1 className="App-title">주사위게임</h1>
        <div>
          <button className="App-button blue" onClick={handleRollClick}>
            던지기
          </button>
          <button className="App-button red" onClick={handleClearClick}>
            처음부터
          </button>
        </div>
      </div>
      <div className="App-boards">
        <Board name="나" color="blue" gameHistory={gameHistory} />
        <Board name="상대" color="red" gameHistory={otherGameHistory} />
      </div>
    </div>
  );
}

export default App;
