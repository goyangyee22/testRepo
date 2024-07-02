import React from "react";
import Dice from "./Dice";

function Board({ name, color, gameHistory }) {
  const sum = gameHistory.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  return (
    <div className="App-board">
      <h2>{name}</h2>
      <Dice color={color} num={gameHistory[gameHistory.length - 1]} />
      <h2>총점</h2>
      <p>{sum}</p>
      <h2>기록</h2>
      <p>{gameHistory.join(", ")}</p>
    </div>
  );
}

export default Board;
