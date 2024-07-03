import { useState } from "react";
import "./App.css";
import reset from "./assets/ic-reset.svg";

function getResult(comparison) {
  if (comparison > 0) return "승리";
  if (comparison < 0) return "패배";
  return "무승부";
}

function App() {
  const [hand, setHand] = useState("rock");
  const [otherHand, setOtherHand] = useState("rock");
  const [score, setScore] = useState(0);
  const [otherScore, setOtherScore] = useState(0);
  const [bet, setBet] = useState(1);
  const [gameHistory, setGameHistory] = useState([]);
  const [isWin, setIsWin] = useState(0);

  const handleButtonClick = (value) => {
    // 사용자가 클릭한 주먹가위보 가져옴
    setHand(value);
    // 상대의 주먹가위보 랜덤추출
    const nextOtherHand = generateRandomHand();
    setOtherHand(nextOtherHand);
    // 승패 결정 ==> 배점을 곱해서 점수 추출
    const comparison = compareHand(value, nextOtherHand);
    setIsWin(comparison);
    if (comparison > 0) setScore(score + bet);
    if (comparison < 0) setOtherScore(otherScore + bet);
    // 결정된 승패를 state에 저장
    const result = getResult(comparison);
    setGameHistory([...gameHistory, result]);
  };

  // 배점을 변경
  const handleBetChange = (e) => {
    let num = Number(e.target.value);
    if (num > 9) num = num % 10;
    if (num < 1) num = 1;
    num = Math.floor(num);
    setBet(num);
  };

  // 초기화
  const handleClearClick = () => {
    setHand("rock");
    setOtherHand("rock");
    setScore(0);
    setOtherScore(0);
    setBet(1);
    setGameHistory([]);
    setIsWin(0);
  };

  return (
    <div className="App">
      <h1 className="App-heading">가위바위보</h1>
      <img className="App-reset" src={reset} onClick={handleClearClick} />
      <div className="App-scores">
        <div className="Score">
          <div className="Score-num">{score}</div>
          <div className="Score-name">나</div>
        </div>
        <div cclassName="App-versus">:</div>
        <div className="Score">
          <div className="Score-num">{score}</div>
          <div className="Score-name">상대</div>
        </div>
      </div>
      <div className="Box App-box">
        {/* 가위바위보 내는 곳 */}
        <div className="App-hands">
          <div></div>
        </div>
        {/* 배점 */}
        {/* 기록 */}
      </div>
    </div>
  );
}

export default App;
